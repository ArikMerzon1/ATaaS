import { CognitoIdentityServiceProvider } from "aws-sdk";
import { ListUsersInGroupRequest, UsersListType } from "aws-sdk/clients/cognitoidentityserviceprovider";
import lDifference from "lodash.difference";
import lUniqBy from "lodash.uniqby";
import lFlatten from "lodash.flatten";
import { inject, injectable } from "tsyringe";
import IUserDAO from "./IUserDAO";
import { User, UserAttributes } from "./User";
import { UserAttributesInput, UserInput } from "./UserInput";

export type CognitoUser = CognitoIdentityServiceProvider.Types.UserType & { GroupNames: string[] };

@injectable()
export default class UserCognitoDAO implements IUserDAO {
  constructor(@inject("cognito") readonly cognito: CognitoIdentityServiceProvider, @inject("userPoolId") readonly userPoolId: string) {}

  private get defaultParams(): { UserPoolId: string } {
    return {
      UserPoolId: this.userPoolId,
    };
  }

  private mapCognitoUser({ Username, Attributes, UserCreateDate, UserLastModifiedDate, UserStatus, Enabled, GroupNames }: CognitoUser): User {
    const allowedAttributes = ["name", "middle_name", "family_name", "email", "phone_number", "email_verified"];
    return {
      userId: Username as string,
      attributes: (Attributes || []).reduce(
        (pV, { Name, Value }) => ({
          ...pV,
          ...(allowedAttributes.includes(Name) ? { [Name]: Value } : {}),
        }),
        {} as UserAttributes
      ),
      userCreateDate: UserCreateDate?.toISOString(),
      userLastModifiedDate: UserLastModifiedDate?.toISOString(),
      userStatus: UserStatus as string,
      enabled: Enabled as boolean,
      groups: GroupNames,
    };
  }

  async fetchUserGroups(userId: string): Promise<string[]> {
    try {
      const response = await this.cognito.adminListGroupsForUser({ ...this.defaultParams, Username: userId }).promise();
      return response.Groups?.map((group) => group.GroupName as string) || [];
    } catch {
      const message = "Group not found";
      console.error(message);
      throw Error(message);
    }
  }

  private async addUserToGroup(userId: string, groupName: string): Promise<void> {
    const groupParams = { ...this.defaultParams, GroupName: groupName };

    try {
      await this.cognito.createGroup(groupParams).promise();
    } catch {
      /* Do nothing if group already exists */
    }

    await this.cognito
      .adminAddUserToGroup({
        ...this.defaultParams,
        Username: userId,
        GroupName: groupName,
      })
      .promise();
  }

  private async setUserPassword(userId: string, password: string = process.env.PASSWORD as string): Promise<void> {
    await this.cognito
      .adminSetUserPassword({
        ...this.defaultParams,
        UserPoolId: this.userPoolId,
        Username: userId,
        Password: password,
        Permanent: true,
      })
      .promise();
  }

  async fetchUsers(groups: string[]): Promise<User[]> {
    console.log("Finding users", { GroupNames: groups });

    const promises = groups.map((GroupName) => {
      const params: ListUsersInGroupRequest = {
        ...this.defaultParams,
        GroupName,
        Limit: 60,
      };

      // we wrap in promise because if it fails we just want to return empty array
      return new Promise<Omit<CognitoUser, "GroupNames">[]>((resolve) => {
        const users: UsersListType = [];

        this.cognito.listUsersInGroup(params, async (_, response) => {
          let listUsersInGroupResponse = response;
          users.push(...(listUsersInGroupResponse?.Users || []));

          while (listUsersInGroupResponse?.NextToken) {
            params.NextToken = listUsersInGroupResponse?.NextToken;

            listUsersInGroupResponse = await this.cognito.listUsersInGroup(params).promise();
            users.push(...(listUsersInGroupResponse?.Users || []));
          }
          resolve(users);
        });
      });
    });

    const flattenedUsers = lUniqBy(lFlatten(await Promise.all(promises)), "Username");

    const users = await Promise.all(
      flattenedUsers.map(async (cognitoUser) => {
        const GroupNames = await this.fetchUserGroups(cognitoUser.Username as string);
        return { ...cognitoUser, GroupNames };
      })
    );

    return users.map(this.mapCognitoUser);
  }

  async create(user: UserInput): Promise<User> {
    const { attributes, groups: GroupNames } = user;

    let existingUser;
    try {
      existingUser = await this.getByEmail(attributes.email);
    } catch {
      /* Do nothing if user doesn't exist */
    }

    if (existingUser) {
      if (existingUser.enabled) {
        const message = "Email already exists";
        console.error(message, { userEmail: attributes.email });
        throw Error(message);
      } else {
        console.log("Updating disabled user", { user });
        await Promise.all([
          this.setEnabled(existingUser.userId, true),
          this.updateAttributes(existingUser.userId, attributes),
          this.updateGroups(existingUser.userId, GroupNames),
        ]);

        return this.getById(existingUser.userId);
      }
    } else {
      const adminCreateUserParams = {
        ...this.defaultParams,
        Username: attributes.email,
        UserAttributes: Object.entries(attributes).map(([Name, Value]) => ({ Name, Value })),
      };

      try {
        console.log("Creating user", { adminCreateUserParams });
        const result = await this.cognito.adminCreateUser(adminCreateUserParams).promise();

        await Promise.all(GroupNames.map((groupName) => this.addUserToGroup(adminCreateUserParams.Username, groupName)));

        const newUser = this.mapCognitoUser({ ...result.User, GroupNames });
        await Promise.all([this.setUserPassword(newUser.userId)]);
        return newUser;
      } catch (error) {
        throw JSON.stringify(error, null, 2);
      }
    }
  }

  async updateAttributes(userId: string, attributes: UserAttributesInput): Promise<void> {
    const defaultParams = {
      ...this.defaultParams,
      Username: userId,
    };

    const adminUpdateUserAttributesParams = {
      ...defaultParams,
      UserAttributes: Object.entries(attributes).map(([Name, Value]) => ({ Name, Value })),
    };

    console.log("Updating attributes", { attributes });

    await this.cognito.adminUpdateUserAttributes(adminUpdateUserAttributesParams).promise();
  }

  async updateGroups(userId: string, groups: string[]): Promise<void> {
    const defaultParams = {
      ...this.defaultParams,
      Username: userId,
    };

    const userGroups = await this.fetchUserGroups(userId);
    const groupsToRemove = lDifference(userGroups, groups);
    const groupsToAdd = lDifference(groups, userGroups);

    console.log("Updating groups", { groups, groupsToRemove, groupsToAdd });

    await Promise.all(
      groupsToRemove.map((GroupName) =>
        this.cognito
          .adminRemoveUserFromGroup({
            ...defaultParams,
            GroupName,
          })
          .promise()
      )
    );

    if (groupsToAdd.length) {
      await Promise.all(groupsToAdd.map((groupName) => this.addUserToGroup(userId, groupName)));
    } else {
      const remainingGroups = lDifference(userGroups, groupsToRemove);

      if (!remainingGroups.length) {
        await this.setEnabled(userId, false);
      }
    }
  }

  async getById(userId: string): Promise<User> {
    const user = await this.cognito
      .adminGetUser({
        ...this.defaultParams,
        Username: userId,
      })
      .promise();

    console.log("found user", { user });

    const GroupNames = await this.fetchUserGroups(userId);

    return this.mapCognitoUser({
      ...user,
      Attributes: user.UserAttributes,
      GroupNames,
    } as CognitoUser);
  }

  async getByEmail(userEmail: string): Promise<User> {
    const res = await this.cognito
      .listUsers({
        ...this.defaultParams,
        Filter: `email = "${userEmail}"`,
      })
      .promise();

    if (!res.Users || !res.Users.length) {
      console.warn("User not found", { userEmail });
      throw Error("User not found");
    }

    const cognitoUser = res.Users[0];
    const GroupNames = await this.fetchUserGroups(cognitoUser.Username as string);
    return this.mapCognitoUser({ ...cognitoUser, GroupNames } as CognitoUser);
  }

  async setEnabled(userId: string, enabled: boolean): Promise<void> {
    if (enabled) {
      await this.cognito
        .adminEnableUser({
          ...this.defaultParams,
          Username: userId,
        })
        .promise();
    } else {
      await this.cognito
        .adminDisableUser({
          ...this.defaultParams,
          Username: userId,
        })
        .promise();
    }
  }
}

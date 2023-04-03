import { container, singleton } from "tsyringe";
import * as AWS from "aws-sdk";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import UserCognitoDAO from "../dao/UserCognitoDAO";
import { UserInput } from "../dao/UserInput";
import isAllowed from "./isAllowed";
import { UserRoleCognito } from "./Enums";

@singleton()
export default class AwsCognitoSetup {
  private region = "eu-central-1";
  private cognito = new CognitoIdentityServiceProvider({
    region: `${this.region}`,
  });

  constructor() {
    AWS.config.update({
      httpOptions: { connectTimeout: 10000, timeout: 5000 },
      maxRetries: 3,
      retryDelayOptions: { base: 500 },
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    });
  }

  async cognitoSetup(user: UserInput): Promise<UserCognitoDAO> {
    console.log("Processing create user", user);
    const allowedGroups = [`${process.env.TEST_CLIENT_ID as string}${UserRoleCognito.ADMIN}`];

    if (
      !isAllowed({
        currentTargetGroups: user.groups,
        newTargetGroups: user.groups,
        currentRequesterGroups: allowedGroups,
      })
    ) {
      const message = "Group not found";
      console.error(message, { userGroups: user.groups, allowedGroups });
      throw Error(JSON.stringify(message, null, 2));
    }

    try {
      container.register("cognito", { useValue: this.cognito });
      container.register("userPoolId", { useValue: process.env.USER_POOL_ID as string });
      return container.resolve(UserCognitoDAO);
    } catch (e) {
      throw Error(e);
    }
  }
}

import { User } from "./User";
import { UserAttributesInput, UserInput } from "./UserInput";

export default interface IUserDAO {
  fetchUsers(groups: string[] | null): Promise<User[]>;
  fetchUserGroups(userId: string): Promise<string[]>;
  create(user: UserInput): Promise<User>;
  updateAttributes(userId: string, attributes: UserAttributesInput): Promise<void>;
  updateGroups(userId: string, groups: string[]): Promise<void>;
  getById(userId: string): Promise<User>;
  getByEmail(userEmail: string): Promise<User>;
  setEnabled(userId: string, enabled: boolean): Promise<void>;
}

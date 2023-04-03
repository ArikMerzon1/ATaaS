export interface User {
  userId: string;
  attributes: UserAttributes;
  userCreateDate?: string;
  userLastModifiedDate?: string;
  userStatus?: string;
  enabled?: boolean;
  groups: Array<string>;
}

export interface UserAttributes {
  email: string;
  name?: string;
  middle_name?: string;
  family_name?: string;
  phone_number?: string;
  email_verified?: boolean;
}

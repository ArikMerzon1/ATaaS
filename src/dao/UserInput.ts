export interface UserInput {
  attributes: UserAttributesInput;
  groups: Array<string>;
}

export interface UserAttributesInput {
  email: string;
  name: string;
  middle_name?: string;
  family_name: string;
  phone_number?: string;
  email_verified?: string;
}

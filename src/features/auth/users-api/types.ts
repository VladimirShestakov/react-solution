export interface SignInBody {
  login: string;
  password: string;
  remember: boolean;
}

export type UsersApiConfig = {
  url: string;
};

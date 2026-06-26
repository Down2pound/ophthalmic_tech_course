import {
  requestPasswordlessSignIn,
  type PasswordlessSignInRequest,
  type RequestPasswordlessSignInInput,
} from "./passwordlessSignIn";

export interface PasswordlessSignInPublicResponse {
  ok: true;
  message: string;
}

export interface PreparedPasswordlessSignIn {
  publicResponse: PasswordlessSignInPublicResponse;
  signInRequest: PasswordlessSignInRequest;
}

export function preparePasswordlessSignInResponse(
  input: RequestPasswordlessSignInInput
): PreparedPasswordlessSignIn {
  return {
    publicResponse: {
      ok: true,
      message:
        "If that email can access OptiTech Academy, a sign-in link will be sent.",
    },
    signInRequest: requestPasswordlessSignIn(input),
  };
}

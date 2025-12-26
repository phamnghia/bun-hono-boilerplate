import type { Context } from "hono";
import { AuthService } from "./auth.service";
import { ok } from "../../utils/response";
import { BadRequestError } from "../../utils/errors";
import { SUCCESS_MESSAGES } from "../../constants";

export const AuthController = {
  googleLogin: (c: Context) => {
    const authUrl = AuthService.getGoogleAuthURL();
    return c.redirect(authUrl);
  },

  googleCallback: async (c: Context) => {
    const code = c.req.query("code");
    if (!code) {
      throw new BadRequestError("No authorization code provided");
    }

    const googleUser = await AuthService.getGoogleUser(code);
    const result = await AuthService.loginOrRegister(googleUser);
    
    if (!result.user) {
      throw new Error("User registration failed");
    }

    return ok(c, { 
      token: result.token, 
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      }
    }, SUCCESS_MESSAGES.AUTH_SUCCESS);
  },
};

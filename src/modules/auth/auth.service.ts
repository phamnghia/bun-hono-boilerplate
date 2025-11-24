import { sign } from "hono/jwt";
import { UserService } from "../user/user.service";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const AuthService = {
  getGoogleAuthURL: () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: "http://localhost:3000/auth/google/callback",
      client_id: process.env.GOOGLE_CLIENT_ID!,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };
    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
  },

  getGoogleUser: async (code: string) => {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: "http://localhost:3000/auth/google/callback",
      grant_type: "authorization_code",
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(values).toString(),
      });
      
      const data = await res.json() as any;
      
      if (!res.ok) {
          throw new Error(data.error_description || "Failed to get tokens");
      }

      const userRes = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${data.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${data.id_token}`,
          },
        }
      );
      
      const googleUser = await userRes.json() as any;
      return googleUser;
    } catch (error) {
      console.error("Error fetching google user", error);
      throw new Error("Failed to fetch Google user");
    }
  },

  loginOrRegister: async (googleUser: any) => {
    let user = await UserService.getByEmail(googleUser.email);

    if (!user) {
      user = await UserService.create({
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.picture,
        googleId: googleUser.id,
      });
    } else if (!user.googleId) {
        // Link account if exists but not linked
        await db.update(users).set({ googleId: googleUser.id, avatar: googleUser.picture }).where(eq(users.id, user.id));
        user = await UserService.getById(user.id);
    }

    const token = await sign({ id: user!.id, email: user!.email }, process.env.JWT_SECRET || "secret");
    return { user, token };
  },
};

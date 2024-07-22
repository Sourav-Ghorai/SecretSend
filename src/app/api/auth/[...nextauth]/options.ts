import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credential",
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { userName: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("User not found!");
          }
          if (!user.isVerified) {
            throw new Error(
              "User not verified. Please verify before logging in"
            );
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user}) {
      if(user){
         token._id = user._id?.toString(); // Convert ObjectId to string
         token.isVerified = user.isVerified;
         token.isAcceptingMessages = user.isAcceptingMessages;
         token.username = user.userName;
      }
      return token;
    },
    async session({ session, token }) {
      if(token){
         session.user._id = token._id;
         session.user.isVerified = token.isVerified;
         session.user.isAcceptingMessages = token.isAcceptingMessages;
         session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};

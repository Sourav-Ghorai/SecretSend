import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { userNameValidation } from "@/schema/signUpSchema";
import { z } from "zod";

const UserNameQuerySchema = z.object({
  userName: userNameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      userName: searchParams.get("username"),
    };

    const result = UserNameQuerySchema.safeParse(queryParams);
    if (!result.success) {
      const usernameErrors = result.error.format().userName?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { userName } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      userName,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error checking unique User name. ", error);
    return Response.json(
      {
        success: false,
        message: "Error in checking unique user name",
      },
      { status: 500 }
    );
  }
}

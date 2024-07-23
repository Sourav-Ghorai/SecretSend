import sendVerificationEmail from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, userName, password } = await request.json();

    const existingUserByUserName = await UserModel.findOne({
      userName,
      isVerified: true,
    });

    if (existingUserByUserName) {
      return NextResponse.json(
        {
          success: false,
          message: "User name already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.userName = userName;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();

        const emailResponse = await sendVerificationEmail(
          email,
          userName,
          verifyCode
        );

        if (!emailResponse.success) {
          return NextResponse.json(
            {
              success: false,
              message: emailResponse.message,
            },
            { status: 500 }
          );
        }

        return NextResponse.json(
          {
            success: true,
            message:
              "Updated successfully. Please check email for OTP verification.",
          },
          { status: 201 }
        );
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        userName,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();

      const emailResponse = await sendVerificationEmail(
        email,
        userName,
        verifyCode
      );
      if (!emailResponse.success) {
        return NextResponse.json(
          {
            success: false,
            message: emailResponse.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message:
            "User registered successfully. Please check email for OTP verification.",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error in registering user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in registering user",
      },
      { status: 500 }
    );
  }
}

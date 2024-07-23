import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/verificationEmail";

export default async function sendVerificationEmail(
  email: string,
  userName: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "SecretSend Verification code",
      react: VerificationEmail({ userName, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Successfully sent the verification email",
    };
  } catch (error) {
    console.log("Error in Sending verification email", error);
    return { success: false, message: "Error in sending verification email" };
  }
}

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function GET(request: Request) {
  await dbConnect();

  try {
    const user = await UserModel.find({ isVerified: true });

    if (!user) {
      return Response.json(
        { success: false, message: "No User registered" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User fetched successfully",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}

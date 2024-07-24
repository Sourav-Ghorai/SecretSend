import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import UserModel from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      // User not found
      return Response.json(
        {
          success: false,
          message: "Unable to find user to update message acceptance status",
        },
        { status: 404 }
      );
    }

    // Successfully updated message acceptance status
    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating message acceptance status:", error);
    return Response.json(
      { success: false, message: "Error updating message acceptance status" },
      { status: 500 }
    );
  }
}

export async function GET(request:Request) {
   await dbConnect();

   const session = await getServerSession(authOptions);
   const user = session?.user;

   if (!session || !user) {
     return Response.json(
       { success: false, message: "Not authenticated" },
       { status: 401 }
     );
   }

   const userId = user._id;

   try {
      const user = await UserModel.findById(userId)
      if(!user){
         return Response.json(
           { success: false, message: "User not found" },
           { status: 404 }
         );
      }
      return Response.json(
        {
          success: true,
          isAcceptingMessages: user.isAcceptingMessages,
        },
        { status: 200 }
      );
   } catch (error) {
       console.error("Error in getting user acceptingMessage status: ", error);
       return Response.json(
         {
           success: false,
           message: "Error in getting user acceptingMessage status",
         },
         { status: 500 }
       );
   }
}
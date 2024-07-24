import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 200 }
      );
    }

    return NextResponse.json({ messages: user[0].messages }, { status: 200 });
  } catch (error) {
    console.error("Internal server error in getting user messages: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error in getting user messages",
      },
      { status: 500 }
    );
  }
}

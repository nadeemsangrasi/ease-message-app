import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "user not authenticated" },
        { status: 404 }
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    const userWithMessages = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

   
    if (!userWithMessages || userWithMessages.length === 0) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        messages:userWithMessages[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error geting  messages", error);
    return Response.json(
      { success: false, message: "Error geting messages" },
      { status: 500 }
    );
  }
}

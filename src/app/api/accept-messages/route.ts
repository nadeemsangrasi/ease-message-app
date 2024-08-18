import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = session.user._id;
    const { acceptMessages } = await req.json();

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to update user status to accept messages",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.log("Error updating accepting messages", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error updating accepting messages",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = session.user._id;

    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.log("Error getting accepting messages", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error getting accepting messages",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { IMessage } from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, content } = await req.json();
    if (!username || !content) {
      return Response.json(
        { success: false, message: "all message fields are required" },
        { status: 500 }
      );
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "user not authenticated" },
        { status: 404 }
      );
    }

    //is user accepting the messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        { success: false, message: "user is not accepting messages" },
        { status: 500 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as IMessage);
    await user.save();
    return Response.json({
      success: true,
      message: "message sent successfully",
    });
  } catch (error) {
    console.log("Error sending message", error);
    return Response.json(
      { success: false, message: "Error sending message" },
      { status: 500 }
    );
  }
}

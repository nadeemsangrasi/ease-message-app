import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, verifyCode } = await req.json();
    if (!username || !verifyCode) {
      return Response.json(
        { success: false, message: " username or verifycode is required" },
        { status: 500 }
      );
    }
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({
      decodedUsername,
    });

    if (!user) {
      return Response.json(
        { success: false, message: "user not found" },
        { status: 500 }
      );
    }

    if (user?.isVerified) {
      return Response.json(
        { success: false, message: "user already varified" },
        { status: 500 }
      );
    }

    const verify: boolean = user.verifyCode === verifyCode;
    const verifyExpiry = new Date(user.verifyCodeExpiry) > new Date();

    if (!verify) {
      return Response.json(
        { success: false, message: "verify code didn't matched" },
        { status: 501 }
      );
    }
    if (!verifyExpiry) {
      return Response.json(
        {
          success: false,
          message: "verify code expired please sign up to verify code again",
        },
        { status: 502 }
      );
    }
    user.isVerified = true;
    await user.save();
    return Response.json(
      { success: true, message: "user varified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error verifying code", error);
    return Response.json(
      { success: false, message: "error verifying code" },
      { status: 500 }
    );
  }
}

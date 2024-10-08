import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import z from "zod";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const quryParam = {
      username: searchParams.get("username"),
    };

    // Validate username with zod
    const result = usernameQuerySchema.safeParse(quryParam);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError.length > 0
              ? usernameError.join(", ")
              : "Invalid query username",
        },
        { status: 400 }
      );
    }

    const { username } = quryParam;
    const existingVarifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVarifiedUser) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "Username is unique" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error checking unique username", error);
    return Response.json(
      { success: false, message: "Error checking unique username" },
      { status: 500 }
    );
  }
}

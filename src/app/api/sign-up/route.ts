import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();
    if (!username || !password || !email) {
      console.error("all fields are required");
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 500 }
      );
    }
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      console.error("username already taken");
      return Response.json(
        { success: false, message: "username already taken" },
        { status: 500 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryVerifyCode = new Date(Date.now() + 3600000);
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email address",
          },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyCodeExpiry = expiryVerifyCode;
      await existingUserByEmail.save();
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryVerifyCode,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    //send verification email notification
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: "Error sending verification email" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message:
          "User registered successfully check your email for verification",
      },
      { status: 200 }
    );
  } catch (userRegisterError) {
    console.error("Error registering user", userRegisterError);
    return Response.json(
      { sucess: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}

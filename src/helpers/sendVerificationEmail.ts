import nodemailer from "nodemailer";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string
) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });

    const subject = "Verify Your Email Address";

    const htmlContent = `
      <p>Hello,${username}</p>
      <p>Thank you for registering with us. Please verify the code given below</p>
      <br>
      <p>${verifyCode}</p>
      <br>
      <p>Best regards,<br>Ease Feedback</p>
    `;

    const mailOptions = await transport.sendMail({
      from: {
        name: "Ease Feedback",
        address: process.env.USER!,
      },
      to: email,
      subject,
      html: htmlContent,
    });

    console.log("Message sent: %s", mailOptions.messageId);
    return { message: "ok", status: 200 };
  } catch (error: any) {
    console.log(error.message);
    return { error: error.message, status: 500 };
  }
};

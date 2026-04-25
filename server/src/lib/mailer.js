const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"NetPulse AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your NetPulse AI Account",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #06b6d4; text-align: center;">NetPulse AI</h2>
        <p>Hello,</p>
        <p>Thank you for registering with NetPulse AI. Please use the following One-Time Password (OTP) to verify your account:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827;">${otp}</span>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e1e1e1; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">&copy; 2026 NetPulse AI. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send verification email");
  }
};

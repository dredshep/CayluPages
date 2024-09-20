// src/pages/api/auth/recover.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import crypto from "crypto";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    try {
      // Check if the user exists
      const user = await prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Generate a token
      const token = crypto.randomBytes(32).toString("hex");

      // Save the reset token in the password_resets table
      await prisma.password_resets.create({
        data: {
          email,
          token,
        },
      });

      // Create the recovery URL
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset?token=${token}&email=${email}`;

      // Send the email
      const transporter = nodemailer.createTransport({
        service: "Gmail", // You can use your email provider
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        html: `<p>You requested a password reset. Click the link below to reset your password:</p>
               <a href="${resetUrl}">Reset Password</a>`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Recovery email sent successfully." });
    } catch (error) {
      console.error("Error sending recovery email:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

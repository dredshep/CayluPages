// src/pages/api/auth/send-verification.ts
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

      if (user.email_verified_at) {
        return res.status(400).json({ error: "Email is already verified." });
      }

      // Generate a token
      const token = crypto.randomBytes(32).toString("hex");

      // Save the token in the email_verifications table
      await prisma.email_verifications.create({
        data: {
          email,
          token,
        },
      });

      // Create the verification URL
      const verificationUrl = `/api/verify-email?token=${token}&email=${email}`;

      // Send the email
      const transporter = nodemailer.createTransport({
        service: "Gmail", // Use your email provider here
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Email Verification",
        html: `<p>Please verify your email by clicking the link below:</p>
               <a href="${verificationUrl}">Verify Email</a>`,
      };

      await transporter.sendMail(mailOptions);

      res
        .status(200)
        .json({ message: "Verification email sent successfully." });
    } catch (error) {
      console.error("Error sending verification email:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

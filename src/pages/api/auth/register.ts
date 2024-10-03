import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";

const prisma = new PrismaClient();

// Create a nodemailer transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Request body:", req.body); // Log the request body

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, name, dni } = req.body as {
    email: string;
    password: string;
    name: string;
    dni: string;
  };

  console.log("Extracted data:", { email, password: "***", name }); // Log extracted data

  // Check if name is provided
  if (!name || name.trim() === "") {
    return res
      .status(400)
      .json({ message: "Es obligatorio introducir un nombre" });
  }

  try {
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await prisma.users.create({
      data: {
        name: name.trim(),
        email,
        password: hashedPassword,
        dni,
        email_verified_at: null,
        verification_token: verificationToken,
      },
    });
    // Get base URL from request headers
    const protocol = req.headers["x-forwarded-proto"] || "http"; // In case it's behind a proxy
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    // Send verification email
    const verificationLink = `${baseUrl}/api/auth/verify?token=${verificationToken}`;
    const sent = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `Please click <a href="${verificationLink}">here</a> to verify your email.`,
    });
    console.log("Email sent:", sent);

    res.status(201).json({
      message:
        "User created successfully. Please check your email to verify your account.",
      userId: Number(user.id),
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}

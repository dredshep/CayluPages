// src/pages/api/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: Date | null;
  };
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    try {
      // Find the user by email
      const user = await prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      // Check if the password matches
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      // Convert BigInt to Number for JWT payload
      const userId = Number(user.id);

      // Generate a JWT token
      const token = jwt.sign(
        {
          id: userId,
          email: user.email,
          name: user.name,
          email_verified_at: user.email_verified_at,
        },
        process.env.JWT_SECRET || "your_jwt_secret1233",
        { expiresIn: "1h" }
      );

      // Send the token and user data
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: userId,
          name: user.name,
          email: user.email,
          email_verified_at: user.email_verified_at,
        },
      } as LoginResponse);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

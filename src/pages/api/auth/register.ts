import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Request body:", req.body); // Log the request body

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, name } = req.body;

  console.log("Extracted data:", { email, password: "***", name }); // Log extracted data

  // Check if name is provided
  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        name: name.trim(),
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User created successfully",
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

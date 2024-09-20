// src/pages/api/auth/reset.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token, email, and new password are required." });
    }

    try {
      // Find the reset request in the database
      const resetRequest = await prisma.password_resets.findFirst({
        where: {
          token,
          email,
        },
      });

      if (!resetRequest) {
        return res.status(400).json({ error: "Invalid token or email." });
      }

      // Check if the token has expired (for example, valid for 1 hour)
      const oneHourAgo = new Date(Date.now() - 3600 * 1000);
      if (new Date(resetRequest.created_at!) < oneHourAgo) {
        return res.status(400).json({ error: "Token has expired." });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update the user's password
      await prisma.users.update({
        where: { email },
        data: { password: hashedPassword },
      });

      // Delete the reset token
      await prisma.password_resets.deleteMany({
        where: { email },
      });

      res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

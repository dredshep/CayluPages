// src/pages/api/auth/verify-email.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({ error: "Token and email are required." });
    }

    try {
      // Find the token in the database
      const verification = await prisma.email_verifications.findFirst({
        where: {
          token,
          email,
        },
      });

      if (!verification) {
        return res.status(400).json({ error: "Invalid token or email." });
      }

      // Check if the token has expired (e.g., valid for 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 3600 * 1000);
      if (new Date(verification.created_at!) < oneDayAgo) {
        return res.status(400).json({ error: "Token has expired." });
      }

      // Mark the email as verified in the users table
      await prisma.users.update({
        where: { email },
        data: { email_verified_at: new Date() },
      });

      // Delete the token
      await prisma.email_verifications.deleteMany({
        where: { email },
      });

      res.status(200).json({ message: "Email verified successfully." });
    } catch (error) {
      console.error("Error verifying email:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ message: "Invalid token" });
  }

  try {
    const user = await prisma.users.findFirst({
      where: { verification_token: token },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    await prisma.users.update({
      where: { id: user.id },
      data: { email_verified_at: new Date(), verification_token: null },
    });

    // Redirect to a success page instead of sending JSON
    res.redirect(302, "/auth/email-verified");
  } catch (error: any) {
    console.error("Verification error:", error);
    res
      .status(500)
      .json({ message: "Error verifying email", error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}

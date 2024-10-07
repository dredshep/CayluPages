import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "@/types/auth/CustomJwtPayload";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;
  const token = req.cookies.auth_token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret1233",
    ) as CustomJwtPayload;

    // Allow users to see their own role
    if (decoded.id && decoded.id.toString() !== id && !decoded.isAdmin) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const userRole = await prisma.model_has_roles.findFirst({
      where: {
        model_type: "App\\Models\\User",
        model_id: parseInt(id as string, 10),
      },
      include: {
        roles: true,
      },
    });

    if (!userRole) {
      return res.status(200).json({ role: "user" });
    }

    res.status(200).json({ role: userRole.roles.name });
  } catch (error) {
    console.error("Error checking user role:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  } finally {
    await prisma.$disconnect();
  }
}

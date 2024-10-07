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
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Temporarily commented out authorization check
  /*
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret1233",
    ) as CustomJwtPayload;

    const userId = parseInt(decoded.id as string, 10);

    // Check if the user has the admin role
    const userRole = await prisma.model_has_roles.findFirst({
      where: {
        model_type: "App\\Models\\User",
        model_id: userId,
        role_id: 1, // Admin role ID
      },
    });

    if (!userRole) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
  */

  try {
    // Fetch the list of areas
    const areas = await prisma.areas.findMany();

    res.status(200).json(
      areas.map((area) => ({ ...area, id: Number(area.id) })),
    );
  } catch (error) {
    console.error("Error fetching areas:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "@/types/auth/CustomJwtPayload";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_jwt_secret1233"
      ) as CustomJwtPayload;

      const user = await prisma.users.findUnique({
        where: { id: parseInt(decoded.id as string, 10) },
        select: {
          id: true,
          email: true,
          name: true,
          email_verified_at:
            typeof decoded.email_verified_at === "string" ? true : false,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ user, token });
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ error: "Invalid or expired token" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

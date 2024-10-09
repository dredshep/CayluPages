import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const oldToken = req.cookies.auth_token;
    console.log({ oldToken });
    if (!oldToken) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      // Check if the token is blacklisted
      const blacklistedToken = await prisma.token_blacklist.findUnique({
        where: { token: oldToken },
      });

      if (blacklistedToken) {
        return res.status(401).json({ error: "Token is blacklisted" });
      }

      // Decode the token without verifying to get the payload
      const decoded = jwt.decode(oldToken) as jwt.JwtPayload;

      if (!decoded) {
        return res.status(401).json({ error: "Invalid token" });
      }

      // Find the user
      const user = await prisma.users.findUnique({
        where: { id: parseInt(decoded.id as string, 10) },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Invalidate the old token by adding it to the blacklist
      await prisma.token_blacklist.create({
        data: {
          token: oldToken,
          expires_at: new Date(decoded.exp! * 1000),
        },
      });

      // Generate a new token
      const newToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          email_verified_at: user.email_verified_at,
        },
        process.env.JWT_SECRET || "your_jwt_secret1233",
        { expiresIn: "1h" },
      );

      // Return the new token in the response
      res.status(200).json({
        message: "Token refreshed successfully",
        token: newToken,
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(401).json({ error: "Invalid token" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

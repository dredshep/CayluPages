import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "@/types/auth/CustomJwtPayload";
import Decimal from "decimal.js";

const prisma = new PrismaClient();

const verifyToken = (token: string | undefined): number => {
  if (!token) {
    throw new Error("No token provided");
  }
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || "your_jwt_secret1233",
  ) as CustomJwtPayload;
  return parseInt(decoded.id as string, 10);
};

const getPreferredAddress = async (userId: number) => {
  return prisma.addresses.findFirst({
    where: { user_id: userId, status: "Active", is_preferred: true },
  });
};

const setPreferredAddress = async (userId: number, addressId: number) => {
  // First, unset the current preferred address
  await prisma.addresses.updateMany({
    where: { user_id: userId, is_preferred: true },
    data: { is_preferred: false },
  });

  // Then, set the new preferred address
  return prisma.addresses.update({
    where: { id: addressId, user_id: userId },
    data: { is_preferred: true },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    const userId = verifyToken(token);
    if (!userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const onGET = async () => {
      const preferredAddress = await getPreferredAddress(userId);
      if (!preferredAddress) {
        return res.status(404).json({ error: "No preferred address found" });
      }
      return res.status(200).json({
        ...preferredAddress,
        user_id: Number(preferredAddress.user_id),
        id: Number(preferredAddress.id),
      });
    };

    const onPUT = async () => {
      const { addressId } = req.body as { addressId: number };
      if (!addressId) {
        return res.status(400).json({ error: "Address ID is required" });
      }
      const updatedAddress = await setPreferredAddress(userId, addressId);
      return res.status(200).json({
        ...updatedAddress,
        user_id: Number(updatedAddress.user_id),
        id: Number(updatedAddress.id),
      });
    };

    switch (req.method) {
      case "GET":
        return onGET();
      case "PUT":
        return onPUT();
      default:
        res.setHeader("Allow", ["GET", "PUT"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error("Error handling preferred user address:", error);
    return res
      .status(error.message === "No token provided" ? 401 : 500)
      .json({ error: error.message || "Internal server error" });
  }
}

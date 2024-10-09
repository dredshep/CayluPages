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

const getAddress = async (userId: number, addressId: number) => {
  return prisma.addresses.findFirst({
    where: { id: addressId, user_id: userId, status: "Active" },
  });
};

const updateAddress = async (
  userId: number,
  addressId: number,
  address: string,
  lat: Decimal,
  lng: Decimal,
) => {
  return prisma.addresses.update({
    where: { id: addressId, user_id: userId },
    data: { address, lat, lng },
  });
};

const deleteAddress = async (userId: number, addressId: number) => {
  await prisma.addresses.update({
    where: { id: addressId, user_id: userId },
    data: { status: "Trash" },
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

    const addressId = parseInt(req.query.id as string, 10);
    if (isNaN(addressId)) {
      return res.status(400).json({ error: "Invalid address ID" });
    }

    const onGET = async () => {
      const address = await getAddress(userId, addressId);
      if (!address) {
        return res.status(404).json({ error: "Address not found" });
      }
      return res.status(200).json({
        ...address,
        user_id: Number(address.user_id),
        id: Number(address.id),
      });
    };

    const onPUT = async () => {
      const { address, lat, lng } = req.body as {
        address: string;
        lat: Decimal;
        lng: Decimal;
      };
      const updatedAddress = await updateAddress(
        userId,
        addressId,
        address,
        lat,
        lng,
      );
      return res.status(200).json({
        ...updatedAddress,
        user_id: Number(updatedAddress.user_id),
        id: Number(updatedAddress.id),
      });
    };

    const onDELETE = async () => {
      await deleteAddress(userId, addressId);
      return res.status(200).json({ message: "Address deleted successfully" });
    };

    switch (req.method) {
      case "GET":
        return onGET();
      case "PUT":
        return onPUT();
      case "DELETE":
        return onDELETE();
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error("Error handling user address:", error);
    return res
      .status(error.message === "No token provided" ? 401 : 500)
      .json({ error: error.message || "Internal server error" });
  }
}

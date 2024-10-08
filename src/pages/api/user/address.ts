import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "@/types/auth/CustomJwtPayload";
import Decimal from "decimal.js";

const prisma = new PrismaClient();

/* return type can come from this: const getAddresses: (userId: number) => Promise<{
    id: bigint;
    user_id: bigint;
    lat: Decimal;
    lng: Decimal;
    address: string | null;
    status: $Enums.addresses_status;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
}[]>

in such case, we should substitute all instances of bigint with number
for that, we have this utility function:
*/

const verifyToken = (token: string | undefined): number => {
  if (!token) {
    throw new Error("No token provided");
  }
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || "your_jwt_secret1233"
  ) as CustomJwtPayload;
  return parseInt(decoded.id as string, 10);
};

const getAddresses = async (userId: number) => {
  return prisma.addresses.findMany({
    where: { user_id: userId, status: "Active" },
  });
};

const createAddress = async (
  userId: number,
  address: string,
  lat: Decimal,
  lng: Decimal
) => {
  if (!lat || !lng) {
    throw new Error("Latitude and longitude are required");
  }
  return prisma.addresses.create({
    data: { user_id: userId, address, lat, lng, status: "Active" },
  });
};

const updateAddress = async (
  userId: number,
  id: number,
  address: string,
  lat: Decimal,
  lng: Decimal
) => {
  if (!id) {
    throw new Error("Address ID is required for updates");
  }
  const existingAddress = await prisma.addresses.findFirst({
    where: { id, user_id: userId },
  });
  if (!existingAddress) {
    throw new Error("Address not found or doesn't belong to the user");
  }
  return prisma.addresses.update({
    where: { id },
    data: { address, lat, lng },
  });
};

const deleteAddress = async (userId: number, id: number) => {
  if (!id) {
    throw new Error("Address ID is required for deletion");
  }
  const existingAddress = await prisma.addresses.findFirst({
    where: { id, user_id: userId },
  });
  if (!existingAddress) {
    throw new Error("Address not found or doesn't belong to the user");
  }
  await prisma.addresses.update({
    where: { id },
    data: { status: "Trash" },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = verifyToken(req.cookies.auth_token);

    const onGET = async () => {
      const addresses = await getAddresses(userId);
      return res.status(200).json(
        addresses.map((address) => ({
          ...address,
          user_id: Number(address.user_id),
          id: Number(address.id),
        }))
      );
    };

    const onPOST = async () => {
      const { address, lat, lng } = req.body as {
        address: string;
        lat: Decimal;
        lng: Decimal;
      };
      const newAddress = await createAddress(userId, address, lat, lng);
      console.log({ newAddress });
      return res.status(201).json({
        ...newAddress,
        id: Number(newAddress.id),
        user_id: Number(newAddress.user_id),
      });
    };

    const onPUT = async () => {
      const { id, address, lat, lng } = req.body as {
        id: number;
        address: string;
        lat: Decimal;
        lng: Decimal;
      };
      const updatedAddress = await updateAddress(userId, id, address, lat, lng);
      return res.status(200).json({
        ...updatedAddress,
        user_id: Number(updatedAddress.user_id),
        id: Number(updatedAddress.id),
      });
    };

    const onDELETE = async () => {
      const { id } = req.body as { id: number };
      await deleteAddress(userId, id);
      return res.status(200).json({ message: "Address deleted successfully" });
    };

    switch (req.method) {
      case "GET":
        return onGET();
      case "POST":
        return onPOST();
      case "PUT":
        return onPUT();
      case "DELETE":
        return onDELETE();
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error("Error handling user address:", error);
    return res
      .status(error.message === "No token provided" ? 401 : 500)
      .json({ error: error.message || "Internal server error" });
  }
}

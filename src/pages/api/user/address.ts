import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "@/types/auth/CustomJwtPayload";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret1233"
    ) as CustomJwtPayload;
    const userId = parseInt(decoded.id as string, 10);

    if (req.method === "GET") {
      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: {
          clients: { select: { address: true, geolocation_id: true } },
        },
      });

      if (!user || !user.clients || user.clients.length === 0) {
        return res.status(404).json({ error: "User address not found" });
      }

      const client = user.clients[0];
      const geolocation = await prisma.geolocations.findUnique({
        where: { id: client.geolocation_id },
      });

      res.status(200).json({
        address: client.address,
        lat: geolocation?.lat,
        lng: geolocation?.lng,
      });
    } else if (req.method === "PUT") {
      const { address, lat, lng } = req.body;

      const updatedGeolocation = await prisma.geolocations.upsert({
        where: { id: userId },
        update: { lat: lat.toString(), lng: lng.toString() },
        create: {
          id: userId,
          lat: lat.toString(),
          lng: lng.toString(),
          status: "Active",
        },
      });

      const updatedClient = await prisma.clients.upsert({
        where: { user_id: userId },
        update: { address, geolocation_id: updatedGeolocation.id },
        create: {
          user_id: userId,
          address,
          geolocation_id: updatedGeolocation.id,
          state_id: 1, // You may need to adjust this
          city_id: 1, // You may need to adjust this
          ref_point: "",
          code_postal: "",
          status: "Active",
        },
      });

      res.status(200).json({
        address: updatedClient.address,
        lat: updatedGeolocation.lat,
        lng: updatedGeolocation.lng,
      });
    } else {
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error handling user address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

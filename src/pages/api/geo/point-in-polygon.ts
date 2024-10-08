import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "@/types/auth/CustomJwtPayload";
import { findPolygonContainingPoint } from "@/utils/geo/geoUtils";
import { Coordinate } from "ol/coordinate";
import { ApiArea, Area } from "@/types/geo/Area";
import apiAreaToArea from "@/utils/geo/apiAreaToArea";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret1233"
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

    const { point } = req.body;

    if (!point || !Array.isArray(point) || point.length !== 2) {
      return res.status(400).json({ error: "Invalid point format" });
    }

    const coord: Coordinate = [point[0], point[1]];

    // Fetch all areas from the database
    const areas = await prisma.areas.findMany();

    // Convert areas to the Area type
    const areaPolygons: ApiArea[] = areas.map((area) => ({
      id: String(area.id),
      name: area.name,
      polygon: JSON.parse(area.polygon as string),
    }));

    const polygonId = findPolygonContainingPoint(
      coord,
      areaPolygons.map(apiAreaToArea)
    );

    if (polygonId) {
      res
        .status(200)
        .json({ areaId: polygonId, message: "Point is inside an area" });
    } else {
      res
        .status(200)
        .json({ areaId: null, message: "Point is not inside any area" });
    }
  } catch (error) {
    console.error("Error in point-in-polygon API:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}

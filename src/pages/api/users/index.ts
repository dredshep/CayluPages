// Path: /src/pages/api/users/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import JSONbig from "json-bigint";
const prisma = new PrismaClient();

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const users = await prisma.users.findMany({
      include: {
        clients: true,
        deliveries: true,
        employee_details: true,
      },
    });
    res.status(200).json(JSONbig.parse(JSONbig.stringify(users)));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

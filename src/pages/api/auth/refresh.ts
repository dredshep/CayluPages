    import { NextApiRequest, NextApiResponse } from "next";
    import { PrismaClient } from "@prisma/client";
    import jwt from "jsonwebtoken";
    import { serialize } from "cookie";

    const prisma = new PrismaClient();

    export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
    ) {
    if (req.method === "POST") {
        const oldToken = req.cookies.auth_token;

        if (!oldToken) {
        return res.status(401).json({ error: "No token provided" });
        }

        try {
        // Verify and decode the old token
        const decoded = jwt.verify(
            oldToken,
            process.env.JWT_SECRET || "your_jwt_secret1233"
        ) as jwt.JwtPayload;

        // Find the user
        const user = await prisma.users.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Invalidate the old token by adding it to a blacklist
        await prisma.token_blacklist.create({
            data: {
            token: oldToken,
            expires_at: new Date(decoded.exp! * 1000), // Convert UNIX timestamp to Date
            },
        });

        // Generate a new token
        const newToken = jwt.sign(
            {
            id: user.id,
            email: user.email,
            name: user.name,
            },
            process.env.JWT_SECRET || "your_jwt_secret1233",
            { expiresIn: "1h" }
        );

        // Set the new token as an HTTP-only cookie
        res.setHeader(
            "Set-Cookie",
            serialize("auth_token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 3600, // 1 hour
            path: "/",
            })
        );

        res.status(200).json({ message: "Token refreshed successfully" });
        } catch (error) {
        console.error("Token refresh error:", error);
        res.status(401).json({ error: "Invalid or expired token" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    }

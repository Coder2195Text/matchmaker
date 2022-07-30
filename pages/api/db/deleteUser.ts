import { Applicant, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const prisma = new PrismaClient();
    if (req.method !== 'DELETE') {
        res.status(405).send("Invalid action")
        return;
    }
    let user: Applicant;
    if (req.query.password == process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        user = await prisma.applicant.delete({
            where: {
                id: <string>req.query.id
            }
        });
        res.status(200).json("Deleted");
    } else {
        res.status(403).json(null);
    }
    return user;
}
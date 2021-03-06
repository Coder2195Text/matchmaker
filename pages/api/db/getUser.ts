import { Applicant, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const prisma = new PrismaClient();
    let user: Applicant;  
    if (req.query.password == process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        user = await prisma.applicant.findUnique({
            where: {
                id: <string>req.query.id
            }
        });
        res.status(200).json(user ? user : {});
    } else {
        res.status(403).json(null);
    }
    return user;
}
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const prisma = new PrismaClient();
    const user = await prisma.applicant.findUnique({
        where: {
            id: <string>req.query.id
        }
    });
    if (req.query.password == process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        res.status(200).send(user);
    } else {
        res.status(405).send(null);
    }
    return user;
}
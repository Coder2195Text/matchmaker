import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Applicant } from "@prisma/client";

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const prisma = new PrismaClient();
	if (req.method !== "POST") {
		res.status(405).send("Not valid action");
		return;
    };
    
	if (req.query.password == process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        await prisma.applicant.create({
            data: req.body
        })
        res.status(200).send("Added");
        
	} else {
		res.status(403).send("Access denied");
	}
}

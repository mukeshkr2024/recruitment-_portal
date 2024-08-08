import { Request, Response } from "express";
import db from "../db";
import { eq } from "drizzle-orm";
import { position } from "../db/schema";

let userId = "7b3c4f20-d565-4b6e-b477-d9decc436ec1"

export const getPostions = async (req: Request, res: Response) => {
    try {

        console.log("called");

        const postions = await db.query.position.findMany()

        console.log("postions", postions);

        return res.status(200).json(postions)
    } catch (error) {
        console.log(error);
    }
}

export const createPosition = async (req: Request, res: Response) => {
    try {
        const { positionName } = req.body

        if (!positionName) {
            return res.status(400).json({ error: "Position name is required" })
        }

        const isAlreadyExists = await db.query.position.findFirst({
            where: eq(position.positionName, positionName)
        })

        if (isAlreadyExists) {
            return res.status(400).json({ error: "Position name already exists" })
        }

        const newPosition = await db.insert(position).values({
            positionName,
            createdBy: userId
        }).returning()

        return res.status(201).json(newPosition)
    } catch (error) {
        console.log(error);
    }
}

export const deletePosition = async (req: Request, res: Response) => {
    try {
        console.log("deletePosition");
        const { positionId } = req.params;

        const deletePosition = await db.delete(position).where(
            eq(position.id, positionId)
        ).returning()

        if (!deletePosition) {
            throw new Error("Position not found")
        }

        return res.status(200).json(deletePosition[0]);
    } catch (error) {
        console.log(error);
    }
}
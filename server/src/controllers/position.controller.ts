import { asc, eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import db from "../db";
import { position } from "../db/schema";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";

let userId = "7b3c4f20-d565-4b6e-b477-d9decc436ec1"

export const getPostions = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postions = await db.query.position.findMany({
            with: {
                assesment: {
                    columns: {
                        id: true
                    }
                }
            },
            orderBy: asc(position.createdAt)
        })

        console.log("postions", postions);

        return res.status(200).json(postions)
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})

export const createPosition = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { positionName } = req.body

        if (!positionName) {
            throw new Error("Position name is required")
        }

        const isAlreadyExists = await db.query.position.findFirst({
            where: eq(position.positionName, positionName)
        })

        if (isAlreadyExists) {
            throw new Error("Already exists")
        }

        const newPosition = await db.insert(position).values({
            positionName,
            createdBy: userId
        }).returning()

        return res.status(201).json(newPosition)
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})

export const deletePosition = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { positionId } = req.params;

        const deletePosition = await db.delete(position).where(
            eq(position.id, positionId)
        ).returning()

        if (!deletePosition) {
            throw new Error("Position not found")
        }

        return res.status(200).json(deletePosition[0]);
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})

export const updatePosition = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("updatePosition");

        const { positionId } = req.params;

        const updatePosition = await db.update(position).set({
            duration: req.body.duration,
        }).where(
            eq(position.id, positionId)
        )

        return res.status(200).json(updatePosition);
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})

export const getPosition = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { positionId } = req.params;

        console.log(positionId);

        const query = await db.query.position.findFirst({
            where: eq(position.id, positionId)
        })

        if (!query) {
            throw new Error("Position not found")
        }

        return res.status(200).json(query);

    } catch (error) {
        return next(new ErrorHandler(error, 400));

    }
})
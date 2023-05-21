import { Request, Response, RequestHandler, NextFunction } from "express";

export const test: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    res.json({ message: "Hello World from trips!" });
};

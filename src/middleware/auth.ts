import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { getRepository } from "typeorm";

require('dotenv').config();
const jwtSecretKey = process.env.JWT_SECRET_KEY;


export const authMiddleware = async (req: Request, res: Response, next:  NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({ message: "No token provided" });
    }

    try{
        if (!jwtSecretKey) {
            throw new Error('JWT_SECRET_KEY is not defined');
        }
        const decoded = jwt.verify(token, jwtSecretKey) as { userId: number };
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({where: {id: decoded.userId}});

        if (!user) {
        return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    }catch(error){
        return res.status(401).json({ message: "Invalid token" });
    }
}
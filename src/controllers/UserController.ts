import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

require('dotenv').config();

export const register = async (req: Request, res: Response) => {
    const {username, password} = req.body;
    const userRepository = getRepository(User);

    const userExists = await userRepository.findOne({ where: username });
    if(userExists){
        return res.status(400).json({message: "User already exist"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({username, password: hashedPassword});
    await userRepository.save(user);
    
    res.status(201).json(user);
}

export const login = async (req: Request, res: Response) =>{
    const {username, password} = req.body;
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({where: username});
    if(user){
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            const jwtSecretKey = process.env.JWT_SECRET_KEY;
            if (!jwtSecretKey) {
                throw new Error('JWT_SECRET_KEY is not defined');
            }
            const token = jwt.sign({ userId: user.id }, jwtSecretKey, { expiresIn: "1h" });
            res.json({token});
            // res.status(201).json({message: "User logged in successfully"})
        }else{
            res.status(400).json({message: "Invalid credentials"})
        }
    }else{
        res.status(400).json({message: "Invalid credentials"})
    }
}
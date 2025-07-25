import { Request, Response, NextFunction } from "express";
import { userInfo } from "../user.DTO/user.DTO";

export const postUserInfoController = async (
    req : Request,
    res : Response,
    next : NextFunction
):Promise<void> => {
    const info : userInfo = req.body;

    
};
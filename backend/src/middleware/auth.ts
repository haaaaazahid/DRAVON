import {Request,Response,NextFunction} from 'express';import jwt from 'jsonwebtoken';
export type AdminRequest=Request&{admin?:{id:string;role:string}};
export function adminAuth(req:AdminRequest,res:Response,next:NextFunction){try{const token=req.cookies?.dravon_admin||req.headers.authorization?.replace('Bearer ','');if(!token) return res.status(401).json({message:'Unauthorized'});const p:any=jwt.verify(token,process.env.JWT_SECRET!);req.admin=p;next()}catch{return res.status(401).json({message:'Unauthorized'})}}

export function requireRole(...roles:string[]){return (req:AdminRequest,res:Response,next:NextFunction)=>{if(!req.admin||!roles.includes(req.admin.role))return res.status(403).json({message:'Forbidden'});next()};}

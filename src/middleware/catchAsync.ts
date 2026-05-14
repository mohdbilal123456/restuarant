import { Request,Response ,NextFunction, RequestHandler } from "express";


const catchAsync = (handler:RequestHandler):RequestHandler =>{
  return async(req:Request ,res:Response,next:NextFunction)=>{
    try {
      await handler(req,res,next)
    } catch (error:any) {
        console.log("JWT ERROR:", error);
      res.status(500).json({
        message:error.message
      })
      
    }
  }
}

export default catchAsync
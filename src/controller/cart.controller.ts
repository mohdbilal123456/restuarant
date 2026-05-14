import mongoose from "mongoose";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/isAuth";
import catchAsync from "../middleware/catchAsync";
import { addItemToCartService, clearCartService, decrementCartItemService, fetchMyCartService, incrementCartItemService } from "../services/cart.service";
import cartModel from "../model/cart.model";

export const addToCart = catchAsync(
  async(req:AuthenticatedRequest,res:Response)=>{

    if(!req.user){
      return res.status(401).json({
        message:"Please Login"
      })
    }

    const userId = req.user._id.toString()

    const { restaurantId, itemId } = req.body

    // Validate ObjectIds

    if(
      !mongoose.Types.ObjectId.isValid(restaurantId) ||
      !mongoose.Types.ObjectId.isValid(itemId)
    ){
      return res.status(400).json({
        message:"Invalid restaurant or item ID"
      })
    }

    const cartItem = await addItemToCartService({
      userId,
      restaurantId,
      itemId
    })

    return res.status(200).json({
      message:"Item added to cart",
      cart:cartItem
    })

})

export const fetchMycart = catchAsync(
  async(req:AuthenticatedRequest,res:Response)=>{

    if(!req.user){
      return res.status(401).json({
        message:"Please Login"
      })
    }

    const userId = req.user._id.toString()

    const cartData = await fetchMyCartService(userId)

    return res.status(200).json({
      success:true,
      cartLength:cartData.cartLength,
      subTotal:cartData.subTotal,
      cart:cartData.cart
    })

})
export const increementCartItem = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {

    const userId = req.user?._id;

    const { itemId } = req.body;

    if (!userId || !itemId) {
      return res.status(400).json({
        message: "Invalid request"
      });
    }

    const cartItem = await incrementCartItemService(
      userId.toString(),
      itemId
    );

    return res.status(200).json({
      message: "Item increased",
      cartItem
    });
  }
);

export const decreementQuantity = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {

    const userId = req.user?._id;

    const { itemId } = req.body;

    if (!userId || !itemId) {
      return res.status(400).json({
        message: "Invalid request"
      });
    }

    const result = await decrementCartItemService(
      userId.toString(),
      itemId
    );

    return res.status(200).json(result);
  }
);

export const clearCart = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    await clearCartService(userId.toString());

    return res.status(200).json({
      message: "Cart Cleared"
    });
  }
);
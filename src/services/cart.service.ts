import mongoose from "mongoose";
import cartModel from "../model/cart.model";

interface AddToCartParams{
  userId:string;
  restaurantId:string;
  itemId:string;
}

export const addItemToCartService = async ({userId,restaurantId,itemId}:AddToCartParams)=>{

  // Check cart contains different restaurant item

  const cartFromDifferentRestaurant = await cartModel.findOne({
    userId,
    restaurantId:{
      $ne:restaurantId
    }
  })

  if(cartFromDifferentRestaurant){
    throw new Error(
      "You can order from only one restaurant at a time. Please clear your cart first."
    )
  }

  // Add item or increase quantity

  const cartItem = await cartModel.findOneAndUpdate(
    {
      userId,
      restaurantId,
      itemId
    },
    {
      $inc:{
        quantity:1
      },
      $setOnInsert:{
        userId,
        restaurantId,
        itemId
      }
    },
    {
      upsert:true,
      new:true,
      setDefaultsOnInsert:true
    }
  )

  return cartItem
}

export const fetchMyCartService = async(userId:string)=>{

  const cartItems = await cartModel.find({ userId })
    .populate("itemId")
    .populate("restaurantId")

  let subTotal = 0
  let cartLength = 0

  for(const cartItem of cartItems){

    const item:any = cartItem.itemId

    subTotal += item.price * cartItem.quantity

    cartLength += cartItem.quantity
  }

  return {
    cart:cartItems,
    subTotal,
    cartLength
  }
}

export const incrementCartItemService = async (
  userId: string,
  itemId: string
) => {

  const cartItem = await cartModel.findOneAndUpdate(
    { userId, itemId },
    {
      $inc: {
        quantity: 1
      }
    },
    { new: true }
  );


  if (!cartItem) {
    throw new Error("Item not found");
  }

  return cartItem;
};

export const decrementCartItemService = async (
  userId: string,
  itemId: string
) => {

  const cartItem = await cartModel.findOne({
    userId,
    itemId
  });

  if (!cartItem) {
    throw new Error("Item not found");
  }

  if (cartItem.quantity === 1) {

    await cartModel.deleteOne({
      userId,
      itemId
    });

    return {
      message: "Item removed from cart"
    };
  }

  cartItem.quantity -= 1;

  await cartItem.save();

  return {
    message: "Item decreased",
    cartItem
  };
};

export const clearCartService = async (userId: string) => {

  await cartModel.deleteMany({
    userId
  });
};
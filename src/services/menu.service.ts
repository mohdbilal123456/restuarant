import axios from "axios";
import getBuffer from "../config/datauri";
import Restaurant from "../model/restaurant.model";
import menuItemModel from "../model/menuItem.model";

export const createMenuItem = async (userId: string, body: any, file: any) => {
  const restaurant = await Restaurant.findOne({ ownerId: userId });

  if (!restaurant) {
    throw new Error("Restaurant Not Found");
  }

  const { name, description, price } = body;

  if (!name || !price) {
    throw new Error("Name and Price are required");
  }

  if (!file) {
    throw new Error("Please provide image");
  }

  const fileBuffer = getBuffer(file);

  if (!fileBuffer?.content) {
    throw new Error("Failed to create file buffer");
  }

  const { data: uploadResult } = await axios.post(
    `${process.env.UTILS_SERVICE}/api/upload`,
    { buffer: fileBuffer.content }
  );

  const item = await menuItemModel.create({
    name,
    description,
    price,
    restaurantId: restaurant._id,
    image: uploadResult?.url,
  });

  return item;
};

export const fetchAllItems = async (restaurantId: string) => {
  if (!restaurantId) {
    throw new Error("Id is Required");
  }

  return await menuItemModel.find({ restaurantId });
};

export const removeMenuItem = async (userId: string, itemId: string) => {
  const item = await menuItemModel.findById(itemId);

  if (!item) {
    throw new Error("No Item Found");
  }

  const restaurant = await Restaurant.findOne({
    _id: item.restaurantId,
    ownerId: userId,
  });

  if (!restaurant) {
    throw new Error("Unauthorized");
  }

  await item.deleteOne();
};

export const toggleAvailability = async (userId: string, itemId: string) => {
  const item = await menuItemModel.findById(itemId);

  if (!item) {
    throw new Error("No Item Found");
  }

  const restaurant = await Restaurant.findOne({
    _id: item.restaurantId,
    ownerId: userId,
  });

  if (!restaurant) {
    throw new Error("Unauthorized");
  }

  item.isAvailable = !item.isAvailable;
  await item.save();

  return item;
};
import catchAsync from "../middleware/catchAsync";
import { AuthenticatedRequest } from "../middleware/isAuth";
import {
  createMenuItem,
  fetchAllItems,
  removeMenuItem,
  toggleAvailability,
} from "../services/menu.service";

export const addMenuItem = catchAsync(async (req: any, res) => {
  
  if (!req.user) {
    return res.status(401).json({ message: "Please Login !!" });
  }

  const item = await createMenuItem(req.user._id, req.body, req.file);

  return res.status(200).json({
    message: "Item Added",
    item,
  });
});

export const getAllItems = catchAsync(async (req:AuthenticatedRequest, res) => {
  const items = await fetchAllItems(req?.params?.id as string);

  return res.status(200).json({
    message: "All Items",
    items,
  });
});

export const deleteMenuItem = catchAsync(async (req: any, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Please Login !!" });
  }

  await removeMenuItem(req.user._id, req.params.itemId);

  return res.status(200).json({
    message: "Menu Item deleted Successfully !!",
  });
});

export const toggleMenuAvailability = catchAsync(async (req: any, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Please Login !!" });
  }

  const item = await toggleAvailability(req.user._id, req.params.itemId);

  return res.status(200).json({
    message: `Item Marked as ${
      item.isAvailable ? "available" : "unavailable"
    }`,
    item,
  });
});
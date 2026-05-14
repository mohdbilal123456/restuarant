import { Response } from "express"
import { AuthenticatedRequest } from "../middleware/isAuth"
import jwt from "jsonwebtoken"
import {
  createRestaurantService,
  getMyRestaurantService,
  getNearbyRestaurantsService,
  getRestaurantById,
  updateRestaurantService,
  updateRestaurantStatusService
} from "../services/restaurant.service"
import catchAsync from "../middleware/catchAsync"
import Restaurant from "../model/restaurant.model"

export const addRestaurant = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized User"
    })
  }

  const restaurant = await createRestaurantService(
    req.user,
    req.body,
    req.file
  )

  return res.status(201).json({
    message: "Restaurant created successfully",
    restaurant
  })
})

export const fetchMyRestaurant = catchAsync(async (req: AuthenticatedRequest, res: Response) => {

  if (!req.user) {
    return res.status(401).json({
      message: "Please login"
    })
  }

  const restaurant = await getMyRestaurantService(req.user._id)

   if (!restaurant) {
    return res.json({
      restaurant: null
    })
  }

  //  token update logic
  if (!req.user.restaurantId) {
    const token = jwt.sign(
      {
        user: {
          ...req.user,
          restaurantId: restaurant._id
        }
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "15d"
      }
    )

    return res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    }).json({
      message: "Restaurant fetched",
      restaurant
    })
  }

  return res.json({
    restaurant
  })
})

export const updateStatuRestaurant = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(403).json({
        message: "Please login",
      });
    }

    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({
        message: "Status must be boolean",
      });
    }

    const restaurant = await updateRestaurantStatusService(
      req.user._id,
      status
    );

    if (!restaurant) {
      return res.status(400).json({
        message: "Restaurant not found",
      });
    }

    res.json({
      message: "Restaurant status updated",
      restaurant,
    });
  }
);

export const updateRestaurant = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(403).json({
        message: "Please login",
      });
    }

    const { name, description } = req.body;

    const restaurant = await updateRestaurantService(req.user._id, {
      name,
      description,
    });

    if (!restaurant) {
      return res.status(400).json({
        message: "Restaurant not found",
      });
    }
    console.log("Restaurant updated",restaurant)
    res.json({
      message: "Restaurant updated",
      restaurant,
    });
  }
);

export const getNearByRestaurant = catchAsync(async (req: AuthenticatedRequest, res) => {
  const { latitude, longitude, radius = 100000, search = "" } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({
      message: "Latitude and longitude are required",
    });
  }

  const restaurants = await getNearbyRestaurantsService({
    latitude: Number(latitude),
    longitude: Number(longitude),
    radius: Number(radius),
    search: String(search),
  });

  return res.status(200).json({
    message: "Nearby restaurants fetched",
    data: restaurants,
  });
});

export const fetchSingleRestaurant = catchAsync(async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const restaurant = await getRestaurantById(req.params.id as string);

  res.status(200).json({
    success: true,
    message: "Restaurant fetched successfully",
    data: restaurant,
  });
});

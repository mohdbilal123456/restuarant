import axios from "axios"
import Restaurant from "../model/restaurant.model"
import getBuffer from "../config/datauri"


interface GetNearbyParams {
  latitude: number;
  longitude: number;
  radius?: number;
  search?: string;
}

export const createRestaurantService = async (user: any, body: any, file: any) => {

  const existingRestaurant = await Restaurant.findOne({
    ownerId: user._id
  })

  if (existingRestaurant) {
    throw new Error("You already have a restaurant")
  }

  const { name, description, latitude, longitude, formattedAddress, phone } = body

  if (!name || !latitude || !longitude) {
    throw new Error("Please give all required details")
  }

  if (!file) {
    throw new Error("Please provide image")
  }

  const fileBuffer = getBuffer(file)

  if (!fileBuffer?.content) {
    throw new Error("Failed to create file buffer")
  }

  const { data: uploadResult } = await axios.post(
    `${process.env.UTILS_SERVICE}/api/upload`,
    {
      buffer: fileBuffer.content,
    }
  )

  const restaurant = await Restaurant.create({
    name,
    description,
    phone,
    image: uploadResult?.url,
    ownerId: user._id,
    autoLocation: {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)],
      formattedAddress
    }
  })

  return restaurant
}

export const getMyRestaurantService = async (userId: string) => {
  const restaurant = await Restaurant.findOne({ ownerId: userId })

  return restaurant
}

export const updateRestaurantStatusService = async (
  userId: string,
  status: boolean
) => {
 
  const restaurant = await Restaurant.findOneAndUpdate(
    { ownerId: userId },
    { isOpen: status },
    { new: true }
  );

  return restaurant;
};

export const updateRestaurantService = async (
  userId: string,
  data: { name?: string; description?: string }
) => {

  const restaurant = await Restaurant.findOneAndUpdate(
    { ownerId: userId },
    {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
    },
    { new: true }
  );


  return restaurant;
};

export const getNearbyRestaurantsService = async ({
  latitude,
  longitude,
  radius,
  search = "",
}: GetNearbyParams) => {

  const query: any = {
    isVerified: {$ne:false},
  };

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  const safeRadius = radius ?? 100000;

  const restaurants = await Restaurant.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        distanceField: "distance",
        maxDistance: safeRadius,
        spherical: true,
        query:query,
        key:"autoLocation"
      },
    },
    {
      $sort: {
        isOpen: -1,
        distance: 1,
      },
    },
    {
      $addFields: {
        distanceKm: {
          $round: [{ $divide: ["$distance", 1000] }, 2],
        },
      },
    },
  ]);

  return restaurants;
};

export const getRestaurantById = async (id: string) => {
  const restaurant = await Restaurant.findById(id);

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  return restaurant;
};
import express from 'express'
import { isAuth, isSeller } from '../middleware/isAuth'
import { addRestaurant, fetchMyRestaurant, fetchSingleRestaurant, getNearByRestaurant, updateRestaurant, updateStatuRestaurant } from '../controller/restaurant.controller'
import uploadFile from '../middleware/multer'
const restaurantRoute = express.Router()


restaurantRoute.post("/addrestaurant",isAuth,isSeller,uploadFile.single("image") ,addRestaurant)
restaurantRoute.get("/myrestaurant",isAuth,isSeller,fetchMyRestaurant)
restaurantRoute.put("/status",isAuth,isSeller,updateStatuRestaurant)
restaurantRoute.put("/edit",isAuth,isSeller,updateRestaurant)
restaurantRoute.get("/all",isAuth,getNearByRestaurant)
restaurantRoute.get("/:id",isAuth,fetchSingleRestaurant)
export default  restaurantRoute
import express from 'express'
import { isAuth } from '../middleware/isAuth'
import { addToCart, clearCart, decreementQuantity, fetchMycart, increementCartItem } from '../controller/cart.controller'

const cartRouter = express.Router()

cartRouter.post("/add-to-cart",isAuth,addToCart)
cartRouter.post("/get-cart",isAuth,fetchMycart)
cartRouter.put("/inc",isAuth,increementCartItem)
cartRouter.put("/dnc",isAuth,decreementQuantity)
cartRouter.delete("/clear",isAuth,clearCart)


export default cartRouter
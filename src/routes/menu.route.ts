import express from 'express'
import { isAuth, isSeller } from '../middleware/isAuth'
import { addMenuItem, deleteMenuItem, getAllItems, toggleMenuAvailability } from '../controller/menu.controller'
import uploadFile from '../middleware/multer'

const menuRouter = express.Router()

menuRouter.post("/additem",isAuth,isSeller,uploadFile.single("file"),addMenuItem)
menuRouter.post("/allitems/:id",isAuth,getAllItems)
menuRouter.delete("/:itemId",isAuth,isSeller,deleteMenuItem)
menuRouter.put("/status/:itemId",isAuth,isSeller,toggleMenuAvailability)
export default menuRouter
import { getHotelById, getHotelsList } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getHotelsList)
  .get("/:hotelId", getHotelById);

export { hotelsRouter };

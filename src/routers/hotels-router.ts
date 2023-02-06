import { getHotelById, getHotelsList } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import {validatePaidTicket, validateUserTicket} from "@/middlewares/user-ticket-middleware";
import { Router } from "express";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken, validateUserTicket, validatePaidTicket)
  .get("/", getHotelsList)
  .get("/:hotelId", getHotelById);

export { hotelsRouter };

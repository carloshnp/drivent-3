import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotelsList(req: AuthenticatedRequest, res: Response) {
  try {
    const hotelsList = await hotelService.getHotelsList();
    res.status(200).send(hotelsList);
  } catch (err) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const hotelId = parseInt(req.params.hotelId);
  try {
    const hotel = hotelService.getHotelRooms(hotelId);
    res.status(200).send(hotel);
  } catch (err) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

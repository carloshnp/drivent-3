import { notFoundError } from "@/errors"
import hotelRepository from "@/repositories/hotel-repository";

async function getHotelsList() {
  const hotelsList = await hotelRepository.getHotelsList();
  if (!hotelsList[0]) {
    throw notFoundError();
  }
  return hotelsList;
}

async function getHotelRooms(hotelId: number) {
  const hotelRooms = await hotelRepository.getHotelRooms(hotelId);
  if (!hotelRooms) {
    throw notFoundError();
  }
  return hotelRooms;
}

const hotelService = {
  getHotelsList,
  getHotelRooms
};

export default hotelService;

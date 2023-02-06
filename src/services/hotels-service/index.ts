import { notFoundError } from "@/errors"
import hotelRepository from "@/repositories/hotel-repository";

async function getHotelsList() {
  const hotelsList = await hotelRepository.getHotelsList();
  if (!hotelsList[0]) {
    throw notFoundError();
  }
  return hotelsList;
}

const hotelService = {
  getHotelsList
};

export default hotelService;

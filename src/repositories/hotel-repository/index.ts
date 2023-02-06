import { prisma } from "@/config";

async function getHotelsList() {
  return await prisma.hotel.findMany();
}

const hotelRepository = {
  getHotelsList
};

export default hotelRepository; 

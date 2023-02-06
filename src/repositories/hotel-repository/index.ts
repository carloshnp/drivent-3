import { prisma } from "@/config";

async function getHotelsList() {
  return await prisma.hotel.findMany();
}

async function getHotelRooms(hotelId: number) {
  return await prisma.hotel.findUnique({
    where: {
      id: hotelId
    },
    include: {
      Rooms: true
    }
  });
}

const hotelRepository = {
  getHotelsList,
  getHotelRooms
};

export default hotelRepository; 

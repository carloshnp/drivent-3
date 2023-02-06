import { prisma } from "@/config";

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: "Ibis Hotel",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEhYkvnFXWrv5O-h7oS7xUJ4Gi-zwMj_vHLfqTYuooIPJedOW6cRJBzJXygGhWIbDKikg&usqp=CAU"
    }
  });
}

export async function createRooms(hotelId: number) {
  await prisma.room.create({
    data: {
      name: "Quarto Simples",
      capacity: 2,
      hotelId
    } 
  });
  return prisma.hotel.findFirst({
    where: {
      id: hotelId
    },
    include: {
      Rooms: true
    }
  });
}

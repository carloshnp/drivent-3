import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.lorem.words(2), 
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEhYkvnFXWrv5O-h7oS7xUJ4Gi-zwMj_vHLfqTYuooIPJedOW6cRJBzJXygGhWIbDKikg&usqp=CAU"
    }
  });
}

export async function createRooms(hotelId: number) {
  await prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: faker.datatype.number(),
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

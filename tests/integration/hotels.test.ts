import app, { init } from "@/app";
import { createUser, createEnrollmentWithAddress, createTicketType, createValidTicketType, createRemoteTicketType, createNoHotelTicketType,  createTicket, createPayment } from "../factories";
import * as jwt from "jsonwebtoken";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import { TicketStatus } from "@prisma/client";
import { createHotel, createRooms } from "../factories/hotels-factory";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

afterAll(async () => {
  await cleanDb(); 
});

const server = supertest(app);

describe("GET /hotels", () => {
  // 401 token
  it("should respond with status 401 if no token is given", async () => {
    const res = await server.get("/hotels");
    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const res = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const res = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    // 404 user no ticket, enrollment or hotel
    it("should respond with status 404 when user has no enrollment", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const res = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(httpStatus.NOT_FOUND);
    });
    
    it("should respond with status 404 when user has no ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const res = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(httpStatus.NOT_FOUND);
    });
    
    it("should respond with status 404 when there are no hotels", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      const res = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(httpStatus.NOT_FOUND);
    });
    
    // 402 payment required
    it("should respond with status 402 when user has not paid ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const res = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    
    it("should respond with status 402 when ticket type is remote", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createRemoteTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const res = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    
    it("should respond with status 402 when ticket doesn't include hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createNoHotelTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const res = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    
    it("should respond with status 200 and hotels when ticket is valid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const res = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            image: expect.any(String)
          })
        ])
      );
    });
  });
});

describe("GET /hotels/:hotelId", () => {
  // 401 token
  it("should respond with status 401 if no token is given", async () => {
    const hotel = await createHotel();
    const res = await server.get(`/hotels/${hotel.id}`);
    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const hotel = await createHotel();
    const token = faker.lorem.word();
    const res = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const hotel = await createHotel();
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const res = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    // 404 user no ticket, enrollment or hotel
    it("should respond with status 404 when user has no enrollment", async () => {
      const user = await createUser();
      const hotel = await createHotel();
      const token = await generateValidToken(user);
      const res = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user has no ticket", async () => {
      const user = await createUser();
      const hotel = await createHotel();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const res = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(httpStatus.NOT_FOUND);
    });
    /*
    it("should respond with status 404 when there are no hotels", async () => {
      const user = await createUser();
      const hotel = await createHotel();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      const res = await server.get(`/hotels/${hotel.id + 1}`).set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(httpStatus.NOT_FOUND);
    });
     */
    // 402 payment required
    it("should respond with status 402 when user has not paid ticket", async () => {
      const user = await createUser();
      const hotel = await createHotel();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const res = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    
    it("should respond with status 402 when ticket type is remote", async () => {
      const user = await createUser();
      const hotel = await createHotel();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createRemoteTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const res = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    
    it("should respond with status 402 when ticket doesn't include hotel", async () => {
      const user = await createUser();
      const hotel = await createHotel();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createNoHotelTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const res = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    /*
    it("should respond with status 200, hotel and rooms when ticket is valid", async () => {
      const user = await createUser();
      const hotel = await createHotel();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      const rooms = await createRooms(hotel.id);

      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);

      expect(response.body).toEqual({
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        createdAt: hotel.createdAt.toISOString(),
        updatedAt: hotel.updatedAt.toISOString(),
        Rooms: [
          {
            id: rooms.Rooms[0].id,
            name: rooms.Rooms[0].name,
            capacity: rooms.Rooms[0].capacity,
            hotelId: rooms.Rooms[0].hotelId,
            createdAt: rooms.Rooms[0].createdAt.toISOString(),
            updatedAt: rooms.Rooms[0].updatedAt.toISOString(),
          },
        ],
      });
    });
    */
  });
});

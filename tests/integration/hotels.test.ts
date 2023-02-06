import app, { init } from "@/app";
import { createUser, createEnrollmentWithAddress, createTicketType, createValidTicketType, createRemoteTicketType, createNoHotelTicketType,  createTicket, createPayment } from "../factories";
import * as jwt from "jsonwebtoken";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import { TicketStatus } from "@prisma/client";

beforeAll(async () => {
  init();
});

afterAll(async () => {
  cleanDb(); 
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
  });
});

describe("GET /hotels/:hotelId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const res = await server.get("/hotels/:hotelId");
    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const res = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const res = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

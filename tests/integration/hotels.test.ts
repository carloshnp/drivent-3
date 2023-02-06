import app, { init } from "@/app";
import { createUser } from "../factories";
import * as jwt from "jsonwebtoken";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  init();
});

afterAll(async () => {
  cleanDb(); 
});

const server = supertest(app);

describe("GET /hotels", async () => {
  it("should respond with status 401 if no token is given"), async () => {
    const res = await server.get("/hotels");
    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  };
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
});

describe("GET /hotels/:hotelId", async () => {
  it("should respond with status 401 if no token is given"), async () => {
    const res = await server.get("/hotels/:hotelId");
    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  };
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

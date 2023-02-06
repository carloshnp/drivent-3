import app, { init } from "@/app";
import supertest from "supertest";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  init();
});

afterAll(async () => {
  cleanDb(); 
});

const server = supertest(app)



const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Job = require("../models/job");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /jobs/:id", () => {
  test("gets a job by id", async () => {
    const job = await Job.create({
      title: "Test Job",
      salary: 100000,
      equity: "0.1",
    });

    const response = await request(app).get(`/jobs/${job.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "Test Job",
        salary: 100000,
        equity: "0.1",
      },
    });
  });

  test("returns 404 if job does not exist", async () => {
    const response = await request(app).get("/jobs/0");

    expect(response.statusCode).toBe(404);
  });
});

describe("PATCH /jobs/:id", () => {
  test("updates a job", async () => {
    const job = await Job.create({
      title: "Test Job",
      salary: 100000,
      equity: "0.1",
    });

    const updates = {
      title: "New Title",
      salary: 200000,
    };

    const response = await request(app).patch(`/jobs/${job.id}`).send(updates);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "New Title",
        salary: 200000,
        equity: "0.1",
      },
    });

    const newJob = await Job.get(job.id);
    expect(newJob).toEqual({
      id: expect.any(Number),
      title: "New Title",
      salary: 200000,
      equity: "0.1",
    });
  });

  test("returns 404 if job does not exist", async () => {
    const updates = {
      title: "New Title",
      salary: 200000,
    };

    const response = await request(app).patch("/jobs/0").send(updates);

    expect(response.statusCode).toBe(404);
  });

  test("returns 400 if invalid data", async () => {
    const job = await Job.create({
      title: "Test Job",
      salary: 100000,
      equity: "0.1",
    });

    const updates = {
      title: 123, // invalid
      salary: "not-a-number", // invalid
    };

    const response = await request(app).patch(`/jobs/${job.id}`).send(updates);

    expect(response.statusCode).toBe(400);
  });
});

describe("DELETE /jobs/:id", () => {
  test("deletes a job", async () => {
    const job = await Job.create({
      title: "Test Job",
      salary: 100000,
      equity: "0.1",
    });

    const response = await request(app).delete(`/jobs/${job.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ deleted: job.id });

    const res = await db.query("SELECT id FROM jobs WHERE id=$1", [job.id]);
    expect(res.rows.length).toEqual(0);
  });

  test("returns 404 if job does not exist", async () => {
    const response = await request(app).delete("/jobs/0");

    expect(response.statusCode).toBe(404);
  });
});
/**
 * No code was selected, so no documentation can be generated.
 */

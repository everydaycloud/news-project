const app = require("../db/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const endpointsTest = require("../endpoints.json")

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("returns an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        expect(body.allTopics).toHaveLength(3); //not sure if I want this in here 
        body.allTopics.forEach((topic) => {
          expect(topic).hasOwnProperty("slug");
          expect(topic).hasOwnProperty("description");
        });
      });
  });
});

describe('Invalid path', () => {
    test('should return a 404 error and path not found msg if the path doesn\'t exist', () => {
        return request(app)
        .get("/api/xyz")
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("path does not exist")
        })
    });
});

describe('get /api', () => {
    test('returns an object of available endpoints', () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((response)=>{
            expect(response.body.endpoints).toEqual(endpointsTest);
        })
    });
});


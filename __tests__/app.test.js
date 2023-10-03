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

describe('get/api getEndpointDescriptions', () => {
    test('returns an object of available endpoints', () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((response)=>{
            expect(response.body.endpoints).toEqual(endpointsTest);
        })
    });
});

describe('get/articles/:article_id getArticlesById', () => {
    test('returns 200 status code and the article object when article id is valid', () => {
        const testArticle = {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              }
        
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res)=>{
            expect(res.body.articleById).toEqual(testArticle);
        })
    });
    test('returns an article object with the correct properties', () => {
        return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then((res)=>{
            expect(res.body.articleById).hasOwnProperty("title");
            expect(res.body.articleById).hasOwnProperty("topic");
            expect(res.body.articleById).hasOwnProperty("author");
            expect(res.body.articleById).hasOwnProperty("body");
            expect(res.body.articleById).hasOwnProperty("created_at");
            expect(res.body.articleById).hasOwnProperty("votes");
            expect(res.body.articleById).hasOwnProperty("article_img_url");
        })
    });
    test("article id does not exist returns error 404 and a message", () => {
        return request(app)
          .get("/api/articles/1234")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("Invalid article id number");
          });
    });
});

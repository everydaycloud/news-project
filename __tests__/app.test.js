const app = require("../db/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const endpointsTest = require("../endpoints.json");

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

describe("Invalid path", () => {
  test("should return a 404 error and path not found msg if the path doesn't exist", () => {
    return request(app)
      .get("/api/xyz")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path does not exist");
      });
  });
});

describe("get/api getEndpointDescriptions", () => {
  test("returns an object of available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.endpoints).toEqual(endpointsTest);
      });
  });
});

describe("get/articles/:article_id getArticlesById", () => {
  test("returns 200 status code and the article object when article id is valid", () => {
    const testArticle = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.articleById).toEqual(testArticle);
      });
  });
  test("returns an article object with the correct properties", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then((res) => {
        expect(res.body.articleById.article_id).toBe(5);
        expect(res.body.articleById).hasOwnProperty("title");
        expect(res.body.articleById).hasOwnProperty("topic");
        expect(res.body.articleById).hasOwnProperty("author");
        expect(res.body.articleById).hasOwnProperty("body");
        expect(res.body.articleById).hasOwnProperty("created_at");
        expect(res.body.articleById).hasOwnProperty("votes");
        expect(res.body.articleById).hasOwnProperty("article_img_url");
      });
  });
  test("article id does not exist returns error 404 and a message", () => {
    return request(app)
      .get("/api/articles/1234")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article not found");
      });
  });
  test("article id in not a number returns error 400 and a message", () => {
    return request(app)
      .get("/api/articles/xyz")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid input type");
      });
  });
});
describe("GET /api/articles get allArticles", () => {
  test("return all articles as an array fo objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.allArticles)).toBe(true);
      });
  });
  test("returns an article array with the correct properties for each article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articles = res.body.allArticles;
        articles.forEach((article) => {
          expect(article).hasOwnProperty("author");
          expect(article).hasOwnProperty("title");
          expect(article).hasOwnProperty("article_id");
          expect(article).hasOwnProperty("topic");
          expect(article).hasOwnProperty("created_at");
          expect(article).hasOwnProperty("votes");
          expect(article).hasOwnProperty("article_img_url");
          expect(article).hasOwnProperty("comment_count");
        });
      });
  });
  test("returns an article array without the body property for each article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articles = res.body.allArticles;
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("the article array should be sorted by date in desc order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articles = res.body.allArticles;
        expect(articles).toBeSortedBy("created_at", {
          coerce: true,
          descending: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments get comments by article id", () => {
  test("should return all comments associated with an article id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.commentsById).toEqual([
          {
            comment_id: 15,
            body: "I am 100% sure that we're not completely sure.",
            article_id: 5,
            author: "butter_bridge",
            votes: 1,
            created_at: "2020-11-24T00:08:00.000Z",
          },
          {
            comment_id: 14,
            body: "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
            article_id: 5,
            author: "icellusedkars",
            votes: 16,
            created_at: "2020-06-09T05:00:00.000Z",
          },
        ]);
      });
  });
  test("should return all comments in desc order by date", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.commentsById).toBeSortedBy("created_at", {
          coerce: true,
          descending: true,
        });
      });
  });
  test("should return a 200 status and messages 'comment not found' if there are no comments for an article", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.commentsById.msg).toBe("No comments found");
      });
  });
  test("article id in not a number returns error 400 and a message", () => {
    return request(app)
      .get("/api/articles/xyz/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid input type");
      });
  });
  test("article does not exist returns error 404 and a message", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments add comment", () => {
  test("responds with status 201 and comment containing appropriate properties when request is correct", () => {
    const addedComment = { username: "butter_bridge", body: "my comment yay!" };
    return request(app)
      .post("/api/articles/3/comments")
      .send(addedComment)
      .expect(201)
      .then((res) => {
        expect(res.body).hasOwnProperty("author");
        expect(res.body).hasOwnProperty("body");
        expect(res.body).hasOwnProperty("article_id");
        expect(res.body).hasOwnProperty("comment_id");
        expect(res.body).hasOwnProperty("votes");
        expect(res.body).hasOwnProperty("created_at");
      });
  });
  test("responds with status 201 and comment containing appropriate properties when request contains extra data", () => {
    const addedComment = {
      username: "butter_bridge",
      body: "my comment yay!",
      date: "1/1/23",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(addedComment)
      .expect(201)
      .then((res) => {
        expect(res.body).hasOwnProperty("author");
        expect(res.body).hasOwnProperty("body");
        expect(res.body).hasOwnProperty("article_id");
        expect(res.body).hasOwnProperty("comment_id");
        expect(res.body).hasOwnProperty("votes");
        expect(res.body).hasOwnProperty("created_at");
      });
  });
  test("responds with status 400 error when request is incomplete", () => {
    const addedComment = { username: "butter_bridge" };
    return request(app)
      .post("/api/articles/3/comments")
      .send(addedComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Username and comment body required");
      });
  });
  test("article id in not a number returns error 400 and a message", () => {
    const addedComment = { username: "butter_bridge", body: "mon" };
    return request(app)
      .post("/api/articles/xyz/comments")
      .send(addedComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid input type");
      });
  });
  test("author not in database returns error 404 and a message", () => {
    const addedComment = { username: "poke", body: "mon" };
    return request(app)
      .post("/api/articles/3/comments")
      .send(addedComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Author not found");
      });
  });
  test("should return a 404 status and message 'article not found' if the article does not exist", () => {
    const addedComment = { username: "butter_bridge", body: "mon" };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(addedComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article not found");
      });
  });
});

describe("PATCH /api/articles/:article_id increments vote count", () => {
  test("should increment the vote count by the number specified in incVotes", () => {
    const inc = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/4")
      .send(inc)
      .expect(200)
      .then((res) => {
        expect(res.body).hasOwnProperty("article_id");
        expect(res.body).hasOwnProperty("topic");
        expect(res.body).hasOwnProperty("author");
        expect(res.body).hasOwnProperty("title");
        expect(res.body).hasOwnProperty("body");
        expect(res.body).hasOwnProperty("created_at");
        expect(res.body).hasOwnProperty("votes");
        expect(res.body).hasOwnProperty("article_img_url");
        expect(res.body.updatedArticle[0].votes).toEqual(1);
      });
  });
  test("should increment the vote count and return the correct article data when there is extra stuff in the request", () => {
    const inc = { inc_votes: 1, numbers: 2 };
    return request(app)
      .patch("/api/articles/4")
      .send(inc)
      .expect(200)
      .then((res) => {
        expect(res.body).hasOwnProperty("article_id");
        expect(res.body).hasOwnProperty("topic");
        expect(res.body).hasOwnProperty("author");
        expect(res.body).hasOwnProperty("title");
        expect(res.body).hasOwnProperty("body");
        expect(res.body).hasOwnProperty("created_at");
        expect(res.body).hasOwnProperty("votes");
        expect(res.body).hasOwnProperty("article_img_url");
        expect(res.body.updatedArticle[0].votes).toEqual(1);
      });
  });
  test("should decrement the vote count and return the correct article data", () => {
    const inc = { inc_votes: -10};
    return request(app)
      .patch("/api/articles/4")
      .send(inc)
      .expect(200)
      .then((res) => {
        expect(res.body).hasOwnProperty("article_id");
        expect(res.body).hasOwnProperty("topic");
        expect(res.body).hasOwnProperty("author");
        expect(res.body).hasOwnProperty("title");
        expect(res.body).hasOwnProperty("body");
        expect(res.body).hasOwnProperty("created_at");
        expect(res.body).hasOwnProperty("votes");
        expect(res.body).hasOwnProperty("article_img_url");
        expect(res.body.updatedArticle[0].votes).toEqual(-10);
      });
  });
  test("should return a 404 status and message 'article not found' if the article does not exist", () => {
    const inc = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/999")
      .send(inc)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article not found");
      });
  });
  test("should return a 400 status if inc_votes has no value or req is not sent on an object", () => {
    const inc = { inc_votes: '' };
    return request(app)
      .patch("/api/articles/4")
      .send(inc)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid increment-by value");
      });
  });
  test("should return a 400 status if inc_votes is not a property of an object", () => {
    const inc = {"number":4};
    return request(app)
      .patch("/api/articles/4")
      .send(inc)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('Bad request - number required as a value of inc_votes key in an object');
      });
  });
  test("should return a 400 status if the article id is not a number", () => {
    const inc = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/xyz")
      .send(inc)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid input type");
      });
  });
});


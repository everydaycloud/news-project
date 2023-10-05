const express = require("express");
const app = express();
const { getAllTopics, getEndpointDescriptions, getArticlesById, getAllArticles,
    getCommentsByArticleId, postCommentByArticleId, patchArticleById, deleteCommentById, getAllUsers } = require("./controller");
const { handle500Errors, handleCustomErrors} = require("./error.controller");

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpointDescriptions);

app.get("/api/articles/:article_id", getArticlesById)

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.get("/api/users", getAllUsers)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.patch("/api/articles/:article_id", patchArticleById)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.all("/*", (req, res, next) => {
    res.status(404).send({ msg: "path does not exist"});
  });

app.use(handleCustomErrors);

app.use(handle500Errors);

module.exports = app;
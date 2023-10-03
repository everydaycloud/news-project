const express = require("express");
const app = express();
const { getAllTopics, getEndpointDescriptions, getArticlesById } = require("./controller");
const { handle500Errors, handleCustomErrors} = require("./error.controller");

//app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpointDescriptions);

app.get("/api/articles/:article_id", getArticlesById)

app.all("/*", (req, res, next) => {
    res.status(404).send({ msg: "path does not exist"});
  });

app.use(handleCustomErrors);

app.use(handle500Errors);

module.exports = app;
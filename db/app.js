const express = require("express");
const app = express();
const { getAllTopics, getEndpointDescriptions } = require("./controller");
const { handle500Errors} = require("./error.controller");

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpointDescriptions);

app.all("/*", (req, res, next) => {
    res.status(404).send({ msg: "path does not exist"});
  });

app.use(handle500Errors);

module.exports = app;
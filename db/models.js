const db = require("./connection");
const endpoints = require("../endpoints.json");

exports.fetchAllTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchEndpointDescriptions = () => {
  return endpoints;
};

exports.fetchArticlesById = (articleId) => {
  if (articleId > 13) {
    return Promise.reject({
      status: 404,
      msg: "Invalid article id number",
    });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
    .then((result) => {
        const article = result.rows[0];
        if (!article) {
          const error = new Error("Article not found");
          error.status = 404;
          throw error;
        }
        return article;
      })
      .catch((error) => {
        if (error.status) {
          throw error;}
        })
};

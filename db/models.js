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
    const regex = /^[0-9]+$/g
  if (!regex.test(articleId)) {
    const error = new Error("Invalid input type");
        error.msg = "Invalid input type";
          error.status = 400;
          throw error;
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
    .then((result) => {
        const article = result.rows[0];
        console.log(result.rowCount)
        if (result.rowCount === 0) {
          const error = new Error("Article not found");
          error.msg = "Article not found";
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

exports.fetchAllArticles = () => {
    return db.query("SELECT * FROM articles;").then(({ rows }) => {
        return rows;
      });
}


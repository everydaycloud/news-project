const db = require("./connection");
const endpoints = require("../endpoints.json");
const format = require("pg-format");

exports.fetchAllTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchEndpointDescriptions = () => {
  return endpoints;
};

exports.fetchArticlesById = (articleId) => {
  const regex = /^[0-9]+$/g;
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
        throw error;
      }
    });
};

exports.fetchAllArticles = () => {
  return db
    .query(
      `SELECT a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url,
        COUNT(c.article_id) AS comment_count
    FROM articles AS a
    LEFT JOIN comments AS c ON a.article_id = c.article_id
    GROUP BY a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url
    ORDER BY a.created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchCommentsByArticleId = (articleId) => {
  const regex = /^[0-9]+$/g;
  if (!regex.test(articleId)) {
    const error = new Error("Invalid input type");
    error.msg = "Invalid input type";
    error.status = 400;
    throw error;
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
    .then((result) => {
      if (result.rowCount === 0) {
        const error = new Error("Article not found");
        error.msg = "Article not found";
        error.status = 404;
        throw error;
      }
    })
    .then(() => {
      return db.query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
        [articleId]
      );
    })
    .then((result) => {
      const comments = result.rows;
      if (result.rowCount === 0) {
        const noComments = { status: 200, msg: "No comments found" };
        return noComments;
      }
      return comments;
    });
};

exports.addCommentByArticleId = (articleId, commentContent) => {
    const regex = /^[0-9]+$/g;
    if (!regex.test(articleId)) {
      const error = new Error("Invalid input type");
      error.msg = "Invalid input type";
      error.status = 400;
      throw error;
    }
  
    return db
      .query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
      .then((result) => {
        if (result.rowCount === 0) {
          const error = new Error("Article not found");
          error.msg = "Article not found";
          error.status = 404;
          throw error;
        }
      })
    .then (()=>{
        return db
      .query(`SELECT * FROM users WHERE username = $1;`, [commentContent.username])
      .then((result) => {
        if (result.rowCount === 0) {
          const error = new Error("Author nor found");
          error.msg = "Author not found";
          error.status = 404;
          throw error;
        }
    })
      })
      .then(() => {
        return db.query(
          `INSERT INTO comments (body, author, article_id)
           VALUES ($1, $2, $3)
           RETURNING *;`,
          [commentContent.body, commentContent.username, articleId]
        )
      })
      .then((result) => {
        return result.rows;
      });
  };
  
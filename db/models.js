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

isTopicValid = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        const topicError = new Error("Invalid topic");
        topicError.msg = "Invalid topic";
        topicError.status = 404;
        throw topicError;
      } else {
        return null;
      }
    });
};

exports.fetchAllArticles = (topic = undefined) => {
  let topicValidationPromise;

  if (topic !== undefined) {
    topicValidationPromise = isTopicValid(topic);
  } else {
    topicValidationPromise = Promise.resolve(null);
  }

  return topicValidationPromise.then((validationResult) => {
    if (validationResult !== null) {
      return validationResult;
    }

    let query = `
            SELECT a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url,
            COUNT(c.article_id) AS comment_count
            FROM articles AS a 
            LEFT JOIN comments AS c ON a.article_id = c.article_id `;

    const values = [];

    if (topic !== undefined) {
      query += `WHERE topic = $1 `;
      values.push(topic);
    }

    query += `
            GROUP BY a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url
            ORDER BY a.created_at DESC;
          `;

    return db
      .query(query, values)
      .then((res) => {
        if (res.rows.length === 0) {
          const noSuchTopic = { status: 200, msg: "No articles on this topic" };
          return noSuchTopic;
        }
        return res.rows;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
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
    .then(() => {
      return db
        .query(`SELECT * FROM users WHERE username = $1;`, [
          commentContent.username,
        ])
        .then((result) => {
          if (result.rowCount === 0) {
            const error = new Error("Author nor found");
            error.msg = "Author not found";
            error.status = 404;
            throw error;
          }
        });
    })
    .then(() => {
      return db.query(
        `INSERT INTO comments (body, author, article_id)
           VALUES ($1, $2, $3)
           RETURNING *;`,
        [commentContent.body, commentContent.username, articleId]
      );
    })
    .then((result) => {
      return result.rows;
    });
};

exports.updateArticleById = (articleId, incVotesBy) => {
  const error1test = /^[0-9]+$/g;
  if (!error1test.test(articleId)) {
    const error = new Error("Invalid input type");
    error.msg = "Invalid input type";
    error.status = 400;
    throw error;
  }
  const error2test = /^[\d +-]+$/g;
  if (!error2test.test(incVotesBy)) {
    const error2 = new Error("Invalid increment-by value");
    error2.msg = "Invalid increment-by value";
    error2.status = 400;
    throw error2;
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
        `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`,
        [incVotesBy, articleId]
      );
    })
    .then((result) => {
      return result.rows;
    });
};

exports.removeCommentById = (commentId) => {
  const error1test = /^[0-9]+$/g;
  if (!error1test.test(commentId)) {
    const error = new Error("Comment id required as a number");
    error.msg = "Comment id required as a number";
    error.status = 400;
    throw error;
  }

  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1;`, [commentId])
    .then((result) => {
      if (result.rowCount === 0) {
        const error = new Error("Comment not found");
        error.msg = "Comment not found";
        error.status = 404;
        throw error;
      }
    })
    .then(() => {
      return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [
        commentId,
      ]);
    })
    .then((result) => {
      return result.rows;
    });
};

exports.fetchAllUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

\c nc_news_test;

-- SELECT article_id FROM articles;
SELECT * FROM articles;
-- SELECT * FROM comments;

-->SELECT article_id, COUNT (*) AS comment_count
-- FROM comments
-- GROUP BY article_id;

-- SELECT * FROM articles
-- JOIN comments
-- ON comments.article_id = articles.article_id;

-- SELECT a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url,
--     COUNT(c.article_id) AS comment_count
-- FROM articles AS a
-- LEFT JOIN comments AS c ON a.article_id = c.article_id
-- GROUP BY a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url;

--SELECT * FROM comments WHERE article_id = 5;

-- SELECT * FROM users WHERE username = 'butter_bridge'; --> check if they exist, if not invalid user account
-- -- username in users is the same as author in comments

-- INSERT INTO comments (body, author, article_id)
--            VALUES ('mon', 'butter_bridge', 3)
--            RETURNING *;

-- SELECT * FROM comments;

-- UPDATE articles
--         SET votes = votes + 1
--         WHERE article_id = 4
--         RETURNING *;

-- SELECT * FROM users;


SELECT a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url,
            COUNT(c.article_id) AS comment_count
            FROM articles AS a 
            LEFT JOIN comments AS c ON a.article_id = c.article_id 
            WHERE a.article_id = 1 
            GROUP BY a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url;
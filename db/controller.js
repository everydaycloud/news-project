const {fetchAllTopics, 
    fetchEndpointDescriptions, 
    fetchArticlesById,
    fetchAllArticles,
    fetchCommentsByArticleId,
    addCommentByArticleId,
    updateArticleById,
    removeCommentById,
    fetchAllUsers } = require("./models")

exports.getAllTopics = (req, res, next) => {
    fetchAllTopics()
    .then((allTopics)=>{
        res.status(200).send({allTopics})
    })
    .catch((err) => {
        next(err);
      });
}

exports.getEndpointDescriptions = (req, res, next)=>{
    const endpoints = fetchEndpointDescriptions()
    res.status(200).send({endpoints})
}

exports.getArticlesById = (req, res, next) => {
    const articleId = req.params.article_id;
    fetchArticlesById(articleId)
    .then((articleById)=>{
        res.status(200).send({articleById})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getAllArticles = (req, res, next) => {
    const {topic} = req.query;

    fetchAllArticles(topic)
    .then((allArticles)=>{
        res.status(200).send({allArticles})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getCommentsByArticleId = (req, res, next) => {
    const id = req.params.article_id;
    fetchCommentsByArticleId(id)
    .then((commentsById)=>{
        res.status(200).send({commentsById})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.postCommentByArticleId = (req, res, next) =>{
    const articleId = req.params.article_id;
    const commentContent = req.body;

    if (commentContent.username === undefined || commentContent.body === undefined){
        return res.status(400).send({msg: 'Username and comment body required'})
    }

    addCommentByArticleId(articleId, commentContent)
    .then((newComment)=>{
        res.status(201).send({newComment})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.patchArticleById = (req, res, next) => {
    const articleId = req.params.article_id;
    const incVotesBy = req.body.inc_votes;

    if (incVotesBy === undefined || typeof req.body !== 'object'){
        return res.status(400).send({msg: 'Bad request - number required as a value of inc_votes key in an object'})
    }

    updateArticleById(articleId, incVotesBy)
    .then((updatedArticle)=>{
        res.status(200).send({updatedArticle})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.deleteCommentById = (req, res, next) =>{
    const commentId = req.params.comment_id

    removeCommentById(commentId)
    .then(()=>{
        res.sendStatus(204)
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getAllUsers = (req, res, next) =>{
    fetchAllUsers()
    .then((allUsers)=>{
        res.status(200).send({allUsers})
    })
    .catch((err)=>{
        next(err)
    })
}
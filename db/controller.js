const {fetchAllTopics, 
    fetchEndpointDescriptions, 
    fetchArticlesById,
    fetchAllArticles,
    fetchCommentsByArticleId} = require("./models")

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
    fetchAllArticles()
    .then((allArticles)=>{
        res.status(200).send({allArticles})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getCommentsByArticleId = (req, res, next) => {
    const id = req.params.article_id;
    console.log('controller', id)
    fetchCommentsByArticleId(id)
    .then((commentsById)=>{
        console.log('controller again', commentsById)
        res.status(200).send({commentsById})
    })
    .catch((err)=>{
        next(err)
    })
}
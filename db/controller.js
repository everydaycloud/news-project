const {fetchAllTopics, 
    fetchEndpointDescriptions, 
    fetchArticlesById} = require("./models")

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
    console.log('inside the controller')
    const articleId = req.params.article_id;
    fetchArticlesById(articleId)
    .then((articleById)=>{
        res.status(200).send({articleById})
    })
    .catch((err)=>{
        next(err)
    })
}
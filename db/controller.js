const {fetchAllTopics, fetchEndpointDescriptions} = require("./models")

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

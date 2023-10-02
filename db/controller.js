const {fetchAllTopics} = require("./models")

exports.getAllTopics = (req, res, next) => {
    fetchAllTopics()
    .then((allTopics)=>{
        res.status(200).send({allTopics})
    })
    .catch((err) => {
        next(err);
      });
}
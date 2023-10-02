const db = require("./connection");
const endpoints = require("../endpoints.json")

exports.fetchAllTopics = ()=>{
    return db.query("SELECT * FROM topics;").then(({rows})=>{
        return rows
    })
}

exports.fetchEndpointDescriptions = () => {
    return endpoints
}

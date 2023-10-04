const { articleData } = require("../data/test-data");
const comments = require("../data/test-data/comments");
const { commentCount, originalArticles }= require("../models")

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.createCommentCountData = (commentCount, originalArticles) => {
  return originalArticles.map((article) => {
    const commentObj = commentCount.find((comment) => {
      return comment.article_id === article.article_id;
    });

    console.log('commentObj', commentObj);
    const commentCountValue = commentObj ? commentObj.comment_count : 0;
    console.log('commentCountValue', commentCountValue);

    return commentCountValue;
  });
};
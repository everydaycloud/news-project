exports.handle500Errors = (err, req, res, next) => {
  console.log('500 error', err)
  res.status(500).send({ msg: "Internal server error" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
  next(err)}
};

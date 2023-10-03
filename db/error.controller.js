exports.handle500Errors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

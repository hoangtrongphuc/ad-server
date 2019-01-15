const error = (err, req, res, next) => {
  console.log(typeof err)
  if (err instanceof Error) {
    return res.status(500).json();
  } else {
    return res.status(err.ec).json(err);
  }
};

module.exports = error;

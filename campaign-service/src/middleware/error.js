const error = (err, req, res, next) => {
  if (err instanceof Error) {
    console.error(err)
    return res.status(500).json();
  } else {
    return res.status(err.ec).json(err);
  }
};

module.exports = error;

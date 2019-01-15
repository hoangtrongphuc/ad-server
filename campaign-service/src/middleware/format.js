const format = (req, res, next) => {
  res.locals = { data: res.locals }
  return res.json(res.locals);
};

module.exports = format;

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // read token
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "There is no token in the request",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_KEY);

    req.userId = uid;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token non valable",
    });
  }
};

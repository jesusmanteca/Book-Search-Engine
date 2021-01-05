const jwt = require("jsonwebtoken");

// set token secret and expiration date
const secret = "purple";
const expiration = "2h";

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    // allows token to be sent via  req.query or headers
    // let token = null;
    //   if (req.body && req.body.token) {
    //     token = req.body.token
    //   } else if (req.query && req.query.token) {
    //     token = req.query.token
    //   } else if ( req.headers && req.headers.authorization) {
    //     token = req.headers.authorization;
    //     token = token.split(" ").pop().trim();
    //   }

    let token = req.body.token || req.query.token || req.headers.authorization;


    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return req;
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      const user = data;
      return { user };
    } catch {
      console.log("Invalid token");
      // return res.status(400).json({ message: "invalid token!" });
    }

    // send to next endpoint
    // next();
    return req;
  },
  
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
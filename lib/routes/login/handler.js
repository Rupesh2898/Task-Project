const models = require("../../models/login");
const bcrypt = require("bcrypt");

const comparePassword = async (plaintextPassword, hash) => {
  try {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
  } catch (error) {
    console.log("At comparePassword Handler...........", error);
    throw new Error(error);
  }
};

const loginValidation = async (server, req, res) => {
  try {
    // check for basic auth header
    if (
      !req.headers.authorization ||
      req.headers.authorization.indexOf("Basic ") === -1
    ) {
      res.statusCode = 401;
      return server.requestResponse.error({
        code: res.statusCode,
        message: "Missing Authorization Header",
      });
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [email, password] = credentials.split(":");

    const getUsersDetails = (
      await server.mysql.query(
        models.getUsersDetails(email.toLowerCase().trim())
      )
    )[0][0];

    if (getUsersDetails)
      if (!getUsersDetails.is_deleted) {
        const comarePassword = await comparePassword(
          password,
          getUsersDetails.password
        );

        if (!comarePassword) {
          res.statusCode = 400;
          return server.requestResponse.error({
            code: res.statusCode,
            message: "Invalid Credential. Try Again !!!!!!!",
          });
        }

        // Creating JWT Token for API authentication
        const token = server.jwt.sign(
          {
            id: getUsersDetails.id,
            name: getUsersDetails.user_name,
            role: getUsersDetails.role,
            email: getUsersDetails.email,
          },
          {
            expiresIn: `24h`,
          }
        );

        return server.requestResponse.success({
          data: {
            id: getUsersDetails.id,
            name: getUsersDetails.user_name,
            role: getUsersDetails.role,
            email: getUsersDetails.email,
            access_token: token,
          },
          message: "Login Successful",
        });
      } else {
        res.statusCode = 401;
        return server.requestResponse.error({
          code: res.statusCode,
          message: "Not Authorized. Contact with Admin.",
        });
      }
    else {
      res.statusCode = 400;
      return server.requestResponse.error({
        code: res.statusCode,
        message: "Invalid Credential. Try Again !!!!!!!",
      });
    }
  } catch (error) {
    res.statusCode = 500;
    return server.requestResponse.error({ message: "Something went wrong" });
  }
};

module.exports = { loginValidation };

const models = require("../../models//users");
const bcrypt = require("bcrypt");

const createUserFunction = async (server, req, res) => {
  try {
    if (
      req.body.role === "SUPER_ADMIN" &&
      (req.user.role === "SUPER_ADMIN" || req.user.role === "ADMIN")
    ) {
      res.statusCode = 400;
      return server.requestResponse.error({
        code: res.statusCode,
        message: "Invalid User Role !!!!!",
      });
    }

    if (req.body.role === "ADMIN" && req.user.role === "ADMIN") {
      res.statusCode = 400;
      return server.requestResponse.error({
        code: res.statusCode,
        message: "You are not Authorized to Create Admin Role !!!!!",
      });
    }

    if (
      !req.body.email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
    ) {
      res.statusCode = 400;
      return server.requestResponse.error({
        code: res.statusCode,
        message: "Invalid Email Formate !!!!!",
      });
    }
    const validateEmail = (
      await server.mysql.query(
        models.validateEmailQuery(req.body.email.toLowerCase().trim())
      )
    )[0][0];
    if (validateEmail) {
      res.statusCode = 400;
      return server.requestResponse.error({
        code: res.statusCode,
        message: "Email Already Exists !!!!!",
      });
    }
    if (req.body.feed_ids && req.body.feed_ids.length != 0) {
      if (req.user.role === "SUPER_ADMIN") {
        const getFeedDetails = (
          await server.mysql.query(
            models.getFeedDetailsQuery(req.body.feed_ids)
          )
        )[0][0];
        if (getFeedDetails.feed_count != req.body.feed_ids.length) {
          res.statusCode = 400;
          return server.requestResponse.error({
            code: res.statusCode,
            message: "Invalid Feed Details !!!!!",
          });
        }
      } else if ((req.user.role = "ADMIN")) {
        const getFeedDetails = (
          await server.mysql.query(
            models.getFeedDetailsQuery(req.body.feed_ids, req.user.id)
          )
        )[0][0];
        if (getFeedDetails.feed_count != req.body.feed_ids.length) {
          res.statusCode = 400;
          return server.requestResponse.error({
            code: res.statusCode,
            message: "Invalid Feed Details !!!!!",
          });
        }
      }
    }

    const hashPassword = await bcrypt.hash(
      req.body.password,
      parseInt(`${server.config.env.SALT_INFO}`, 10)
    );

    await server.mysql.query(
      models.createtUserQuery(
        req.body.email.trim(),
        req.body.name.trim(),
        hashPassword,
        req.body.role,
        req.user.id
      )
    );

    if (req.body.feed_ids && req.body.feed_ids.length != 0) {
      // Get User Details

      const getUsersDetails = (
        await server.mysql.query(
          models.validateEmailQuery(req.body.email.toLowerCase().trim())
        )
      )[0][0];

      // Assign Feed to User

      await server.mysql.query(
        models.assignUserFeedQuery(
          req.body.feed_ids,
          getUsersDetails.id,
          req.user.id
        )
      );
    }

    return server.requestResponse.success({
      message: "User Created Successfully",
    });
  } catch (error) {
    console.log("createUserFunction ~ error:", error);
    res.statusCode = 500;
    return server.requestResponse.error({ message: "Something went wrong" });
  }
};

module.exports = { createUserFunction };

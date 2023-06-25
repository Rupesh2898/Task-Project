const models = require("../../models/feeds");
const server = require("../../plugins/server");

const createFeedFunction = async (server, req, res) => {
  try {
    // Validate User IDs
    if (req.body.user_ids && req.body.user_ids.length != 0) {
      const verifyUserIds = (
        await server.mysql.query(models.verifyUserIdsQuery(req.body.user_ids))
      )[0];

      if (verifyUserIds.length != req.body.user_ids.length) {
        res.statusCode = 400;
        return server.requestResponse.error({
          code: res.statusCode,
          message: "Invalid User Details !!!!!",
        });
      }

      if (req.user.role === "ADMIN") {
        for (const item of verifyUserIds) {
          if (item.role === "ADMIN") {
            res.statusCode = 400;
            return server.requestResponse.error({
              code: res.statusCode,
              message: "You can Assign Admin to Feed !!!!!",
            });
          }
        }
      }
    }

    // Create Feed

    await server.mysql.query(
      models.createFeedQuery(
        req.body.name,
        req.body.url ? req.body.url : null,
        req.body.description ? req.body.description : null,
        req.user.id
      )
    );

    if (req.body.user_ids && req.body.user_ids.length != 0) {
      // Get User Details
      const getFeedDetails = (
        await server.mysql.query(models.getFeedDetailsQuery(req.body.name))
      )[0][0];

      // Assign Feed to users

      await server.mysql.query(
        models.assignUserFeedQuery(
          getFeedDetails.id,
          req.body.user_ids,
          req.user.id
        )
      );
    }

    return server.requestResponse.success({
      message: "Feed Created Successfully",
    });
  } catch (error) {
    console.log("createFeedFunction ~ error:", error);
    res.statusCode = 500;
    return server.requestResponse.error({ message: "Something went wrong" });
  }
};

const getFeedListFunction = async (server, req, res) => {
  try {
    let getFeedList;
    if (req.user.role != "SUPER_ADMIN") {
      getFeedList = (
        await server.mysql.query(models.getFeedListQueryAdmin(req.user.id))
      )[0];
    } else {
      getFeedList = (
        await server.mysql.query(models.getFeedListQuerySuperAdmin())
      )[0];
    }

    return server.requestResponse.success({
      message: "Request Success",
      data: getFeedList,
    });
  } catch (error) {
    console.log("createFeedFunction ~ error:", error);
    res.statusCode = 500;
    return server.requestResponse.error({ message: "Something went wrong" });
  }
};

const getFeedDetailsFunction = async (server, req, res) => {
  try {
    let getFeedDetails;
    if (req.user.role != "SUPER_ADMIN") {
      getFeedDetails = (
        await server.mysql.query(
          models.getFeedDetailsQueryAdmin(req.user.id, req.params.feed_id)
        )
      )[0][0];
    } else {
      getFeedDetails = (
        await server.mysql.query(
          models.getFeedDetailsQuerySuperAdmin(req.params.feed_id)
        )
      )[0][0];
    }

    if (!getFeedDetails) {
      res.statusCode = 400;
      return server.requestResponse.error({
        code: res.statusCode,
        message: "Invalid Feed Details !!!!!",
      });
    }

    return server.requestResponse.success({
      message: "Request Success",
      data: getFeedDetails,
    });
  } catch (error) {
    console.log("createFeedFunction ~ error:", error);
    res.statusCode = 500;
    return server.requestResponse.error({ message: "Something went wrong" });
  }
};

const deleteFeedFunction = async (server, req, res) => {
  try {
    let getFeedDetails;
    if (req.user.role != "SUPER_ADMIN") {
      getFeedDetails = (
        await server.mysql.query(
          models.getFeedDetailsQueryAdmin(req.user.id, req.params.feed_id)
        )
      )[0][0];
    } else {
      getFeedDetails = (
        await server.mysql.query(
          models.getFeedDetailsQuerySuperAdmin(req.params.feed_id)
        )
      )[0][0];
    }

    if (!getFeedDetails) {
      res.statusCode = 400;
      return server.requestResponse.error({
        code: res.statusCode,
        message: "Invalid Feed Details !!!!!",
      });
    }

    if (!getFeedDetails.feed_editable) {
      res.statusCode = 400;
      return server.requestResponse.error({
        code: res.statusCode,
        message: "Not Authorized to delete Feed !!!!!",
      });
    }

    // Delete Feed

    await server.mysql.query(
      models.deleteFeedQuery(req.params.feed_id, req.user.id)
    );

    return server.requestResponse.success({
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.log("handler.js:123 ~ deleteFeedFunction ~ error:", error);
    res.statusCode = 500;
    return server.requestResponse.error({
      message: "Something went wrong",
    });
  }
};

const assignFeedtoUserFunction = async (server, req, res) => {
  try {
    let getFeedDetails;
    if (req.user.role != "SUPER_ADMIN") {
      getFeedDetails = (
        await server.mysql.query(
          models.getFeedDetailsQueryAdmin(req.user.id, req.params.feed_id)
        )
      )[0][0];
    } else {
      getFeedDetails = (
        await server.mysql.query(
          models.getFeedDetailsQuerySuperAdmin(req.params.feed_id)
        )
      )[0][0];
    }

    if (!getFeedDetails) {
      res.statusCode = 400;
      return server.requestResponse.error({
        code: res.statusCode,
        message: "Invalid Feed Details !!!!!",
      });
    }
    // Validate User IDs
    if (req.body.user_ids && req.body.user_ids.length != 0) {
      const verifyUserIds = (
        await server.mysql.query(models.verifyUserIdsQuery(req.body.user_ids))
      )[0];

      if (verifyUserIds.length != req.body.user_ids.length) {
        res.statusCode = 400;
        return server.requestResponse.error({
          code: res.statusCode,
          message: "Invalid User Details !!!!!",
        });
      }

      if (req.user.role === "ADMIN") {
        for (const item of verifyUserIds) {
          if (item.role === "ADMIN") {
            res.statusCode = 400;
            return server.requestResponse.error({
              code: res.statusCode,
              message: "You can Assign Admin to Feed !!!!!",
            });
          }
        }
      }
    }

    await server.mysql.query(
      models.assignUserFeedQuery(
        getFeedDetails.id,
        req.body.user_ids,
        req.user.id
      )
    );
    return server.requestResponse.success({
      message: "Feed Updated Successfully",
    });
  } catch (error) {
    console.log("assignFeedtoUserFunction ~ error:", error);
    res.statusCode = 500;
    return server.requestResponse.error({
      message: "Something went wrong",
    });
  }
};

const updatefeedediteAccessFunction = async (server, req, res) => {
  try {
    const getFeedDetails = (
      await server.mysql.query(
        models.getFeedDetailsQueryAdmin(req.params.user_id, req.params.feed_id)
      )
    )[0][0];

    if (!getFeedDetails) {
      res.statusCode = 400;
      return server.requestResponse.error({
        code: res.statusCode,
        message: "Invalid Feed Details !!!!!",
      });
    }

    const verifyUserIds = (
      await server.mysql.query(models.verifyUserIdsQuery([req.params.user_id]))
    )[0][0];

    if (!verifyUserIds) {
      res.statusCode = 400;
      return server.requestResponse.error({
        code: res.statusCode,
        message: "Invalid User Details !!!!!",
      });
    }

    if (verifyUserIds.role === "USER") {
      res.statusCode = 400;
      return server.requestResponse.error({
        code: res.statusCode,
        message: "User can not edit Feed!!!!!",
      });
    }

    await server.mysql.query(
      models.updatefeedediteAccessQuery(req.params.feed_id, req.params.user_id)
    );

    return server.requestResponse.success({
      message: "Feed Access Updated Successfully",
    });
  } catch (error) {
    console.log("updatefeedediteAccessFunction ~ error:", error);
    res.statusCode = 500;
    return server.requestResponse.error({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createFeedFunction,
  getFeedListFunction,
  getFeedDetailsFunction,
  deleteFeedFunction,
  assignFeedtoUserFunction,
  updatefeedediteAccessFunction,
};

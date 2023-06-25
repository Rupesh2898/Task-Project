const SQL = require("@nearform/sql");

const getFeedDetailsQuery = (feed_ids) => {
  try {
    return SQL`SELECT 
                    COUNT(*) AS feed_count 
                FROM 
                    feed_details 
                WHERE 
                    id IN (${feed_ids}) 
                AND 
                    is_deleted = false;`;
  } catch (error) {
    console.log("getFeedDetailsQuery ~ error:", error);
    throw new Error(error);
  }
};

const getFeedDetailsAdminQuery = (feed_ids, user_id) => {
  try {
    return SQL`SELECT 
                    COUNT(*) AS feed_count 
                FROM 
                    users_feed 
                WHERE 
                    feed_id IN (${feed_ids})
                AND
                    user_id = ${user_id} 
                AND 
                    is_deleted = false;`;
  } catch (error) {
    console.log("getFeedDetailsAdminQuery ~ error:", error);
    throw new Error(error);
  }
};

const validateEmailQuery = (email) => {
  try {
    return SQL`SELECT
                        id
                    FROM
                        users_details
                    WHERE
                        LOWER(email) = ${email}
                    AND
                        is_deleted = false
        `;
  } catch (error) {
    console.log("validateEmailQuery ~ error:", error);
  }
};

const createtUserQuery = (email, name, password, role, created_by) => {
  try {
    return SQL`INSERT INTO users_details (user_name, email, password, role, created_by) VALUES(${name}, ${email}, ${password}, ${role}, ${created_by})`;
  } catch (error) {
    console.log("🚀 ~ file: users.js:57 ~ createtUserQuery ~ error:", error);
    throw new Error(error);
  }
};

const assignUserFeedQuery = (feed_ids, user_id, created_by) => {
  try {
    const values = feed_ids.map(
      (item) => SQL`(${item}, ${user_id}, ${created_by})`
    );
    console.log(values);
    return SQL`INSERT INTO users_feed (feed_id, user_id, created_by) VALUES ${SQL.glue(
      values,
      " , "
    )} ON DUPLICATE KEY UPDATE is_deleted = false`;
  } catch (error) {
    console.log("assignUserFeedQuery ~ error:", error);
    throw new Error(error);
  }
};

module.exports = {
  getFeedDetailsQuery,
  getFeedDetailsAdminQuery,
  validateEmailQuery,
  createtUserQuery,
  assignUserFeedQuery,
};

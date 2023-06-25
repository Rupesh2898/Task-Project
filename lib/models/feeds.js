const SQL = require("@nearform/sql");

const verifyUserIdsQuery = (user_ids) => {
  try {
    return SQL`SELECT 
                    id, role                
                FROM
                    users_details
                WHERE
                    id IN (${user_ids}) 
                AND 
                    role IN ("ADMIN", "USER")
                AND 
                    is_deleted = false;
                `;
  } catch (error) {
    console.log("🚀 ~ file: feeds.js:7 ~ verifyUserIdsQuery ~ error:", error);
    throw new Error(error);
  }
};

const createFeedQuery = (name, url = null, description = null, created_by) => {
  try {
    return SQL`INSERT INTO feed_details (name, url, description, created_by) VALUES(${name}, ${url}, ${description}, ${created_by})`;
  } catch (error) {
    console.log("createFeedQuery ~ error:", error);
    throw new Error(error);
  }
};

const getFeedDetailsQuery = (name) => {
  try {
    return SQL`SELECT 
                    id 
                FROM 
                    feed_details 
                WHERE 
                    name = ${name} 
                AND 
                    is_deleted = false 
                ORDER BY id DESC
                LIMIT 1;`;
  } catch (error) {
    console.log("🚀 ~ file: feeds.js:34 ~ getFeedDetailsQuery ~ error:", error);
    throw new Error(error);
  }
};

const assignUserFeedQuery = (feed_id, user_ids, created_by) => {
  try {
    const values = user_ids.map(
      (item) => SQL`(${item}, ${feed_id}, ${created_by})`
    );
    return SQL`INSERT INTO users_feed (user_id, feed_id, created_by) VALUES ${SQL.glue(
      values,
      " , "
    )} ON DUPLICATE KEY UPDATE is_deleted = false`;
  } catch (error) {
    console.log("assignUserFeedQuery ~ error:", error);
    throw new Error(error);
  }
};

const getFeedListQueryAdmin = (user_id) => {
  try {
    return SQL`SELECT 
                    id,
                    name
                  FROM 
                    feed_details
                  INNER JOIN
                    users_feed
                  ON
                    users_feed.feed_id = feed_details.id    
                  AND
                    users_feed.is_deleted = false
                  WHERE
                    users_feed.user_id = ${user_id}
                  AND
                    feed_details.is_deleted = false
    `;
  } catch (error) {
    console.log("getFeedListQueryAdmin ~ error:", error);
    throw new Error(error);
  }
};

const getFeedDetailsQueryAdmin = (user_id, feed_id) => {
  try {
    return SQL`SELECT 
                    id,
                    name,
                    url,
                    description,
                    feed_editable
                  FROM 
                    feed_details
                  INNER JOIN
                    users_feed
                  ON
                    users_feed.feed_id = feed_details.id    
                  AND
                    users_feed.is_deleted = false
                  WHERE
                    users_feed.user_id = ${user_id}
                  AND
                    users_feed.feed_id = ${feed_id}
                  AND
                    feed_details.is_deleted = false
    `;
  } catch (error) {
    console.log("getFeedListQueryAdmin ~ error:", error);
    throw new Error(error);
  }
};

const getFeedListQuerySuperAdmin = () => {
  try {
    return SQL`SELECT 
                    id,
                    name
                  FROM 
                    feed_details
                  WHERE
                    feed_details.is_deleted = false
    `;
  } catch (error) {
    console.log("getFeedListQueryAdmin ~ error:", error);
    throw new Error(error);
  }
};

const getFeedDetailsQuerySuperAdmin = (feed_id) => {
  try {
    return SQL`SELECT 
                    id,
                    name,
                    url,
                    description,
                    true AS feed_editable
                  FROM 
                    feed_details
                  WHERE
                    feed_details.id = ${feed_id}
                  AND
                    feed_details.is_deleted = false
    `;
  } catch (error) {
    console.log("getFeedListQueryAdmin ~ error:", error);
    throw new Error(error);
  }
};

const deleteFeedQuery = (feed_id, deleted_by) => {
  try {
    return SQL`UPDATE feed_details SET is_deleted = true, deleted_by = ${deleted_by} WHERE id = ${feed_id}`;
  } catch (error) {
    console.log("deleteFeedQuery ~ error:", error);
    throw new Error(error);
  }
};

const updatefeedediteAccessQuery = (feed_id, user_id) => {
  try {
    return SQL`UPDATE users_feed SET feed_editable = true WHERE feed_id = ${feed_id} AND user_id = ${user_id} AND is_deleted = false`;
  } catch (error) {
    console.log("updatefeedediteAccessQuery ~ error:", error);
    throw new Error(error);
  }
};

module.exports = {
  verifyUserIdsQuery,
  createFeedQuery,
  getFeedDetailsQuery,
  assignUserFeedQuery,
  getFeedListQueryAdmin,
  getFeedListQuerySuperAdmin,
  getFeedDetailsQuerySuperAdmin,
  getFeedDetailsQueryAdmin,
  deleteFeedQuery,
  updatefeedediteAccessQuery,
};

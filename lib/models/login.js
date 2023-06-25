const SQL = require("@nearform/sql");

const getUsersDetails = (email) => {
  try {
    return SQL`SELECT 
                    * 
                FROM 
                    users_details 
                WHERE 
                    LOWER(email) = ${email};`;
  } catch (error) {
    console.log("getUsersDetails ~ error:", error);
    throw new Error(error);
  }
};

module.exports = { getUsersDetails };

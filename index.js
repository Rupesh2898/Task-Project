const configuration = require("./lib/config/fastify");
const startServer = require("./lib/plugins/server");
const SQL = require("@nearform/sql");
const bcrypt = require("bcrypt");

const start = async () => {
  // fastify configuration
  const config = configuration.fastifyConfig;

  // env configuration
  const envConfig = configuration.env;

  // require fastify
  const server = require("fastify")(config.fastifyInit);

  server.register(require("@fastify/cors"), {
    // put your options here
  });

  // register all plugings, decorators
  await server.register(startServer, {
    fastifyConfig: config,
    envConfig: envConfig,
  });

  // register jwt for authentication
  server.register(require("@fastify/jwt"), {
    secret: server.config.env.JWT_SECRET,
  });

  // Create Super Admin if not exists

  const getSuperAdminInfo = (
    await server.mysql.query(
      SQL`SELECT 
              COUNT(*) AS user_count
            FROM 
              users_details 
            WHERE 
              role = "SUPER_ADMIN" 
            AND 
              is_deleted = false`
    )
  )[0][0];

  if (!getSuperAdminInfo.user_count) {
    const hashPassword = await bcrypt.hash(
      server.config.env.SUPER_ADMIN_PASSWORD,
      parseInt(`${server.config.env.SALT_INFO}`, 10)
    );

    // Create Super Admin if not exist

    await server.mysql.query(
      SQL`INSERT INTO users_details (user_name, role, email, password) VALUES(${server.config.env.SUPER_ADMIN_NAME}, "SUPER_ADMIN", ${server.config.env.SUPER_ADMIN_EMAIL}, ${hashPassword})`
    );
    console.log("Super Admin Created Successfully");
    console.log(hashPassword);
  }

  // listen to the port
  await server.listen(config.fastify);
};

start();

const fp = require("fastify-plugin");
const autoLoad = require("@fastify/autoload");
const { join } = require("path");
const jwt = require("./authentication/index");
const userAuthorization = require("./authorization/index");
const database = require("./database/index");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

async function plugin(server, config) {
  // on request log

  const orderReccentFiles = (dir) => {
    return fs
      .readdirSync(dir)
      .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
      .map((file) => ({
        file,
        mtime: fs.lstatSync(path.join(dir, file)).mtime,
      }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  };

  const maxTimeMs = moment().format("x");
  server.addHook("onRequest", async (req) => {
    if (config.fastifyConfig.fastifyInit.enableRequestLogging)
      req.log.info({ req }, "incoming request");

    const fileData = `
  Date: ${moment().format("DD-MMM-YYYY HH:mm:ss")},
  Method: ${req.method},
  Endpoint: ${req.url},
  Body: ${req.body ? req.body : null}
        `;
    // Read the files from the source directory
    const getMostRecentFile = (dir) => {
      const files = orderReccentFiles(dir);
      return files.length ? files[0] : undefined;
    };

    const getLatestfile = getMostRecentFile("storage");
    if (getLatestfile) {
      const fileStat = fs.statSync(`storage/${getLatestfile.file}`);
      if (maxTimeMs - fileStat.birthtime > 300000) {
        fs.appendFileSync(
          `./storage/${moment().format("x")}-api.log`,
          fileData + "\n"
        );
      } else
        fs.appendFileSync(`./storage/${getLatestfile.file}`, fileData + "\n");
    } else {
      fs.appendFileSync(
        `./storage/${moment().format("x")}-api.log`,
        fileData + "\n"
      );
    }
    // console.log(maxTimeMs - fileStat.birthtime);
    // if (fileStat.birthtimeMs < maxTimeMs) uploadFileFiles.push(file);
    // console.log("A", getLatestfile);
  });

  // on response log
  server.addHook("onResponse", async (req, res) => {
    if (config.fastifyConfig.fastifyInit.enableRequestLogging)
      req.log.info({ req, res }, "request completed");
  });

  // default response structure
  server.decorate("requestResponse", {
    success: (data) => {
      try {
        return {
          status: data.status
            ? typeof data.status === "boolean"
              ? data.status
              : true
            : true,
          statusCode: data.code
            ? typeof data.code === "number"
              ? data.code
              : 200
            : 200,
          message: data.message || "Successful",
          resources: { data: data.data } || {},
        };
      } catch (error) {
        console.log("plugin ~ requestResponse ~ success ~ error:", error);
        throw new Error(error);
      }
    },
    error: (data) => {
      try {
        return {
          status: data.status
            ? typeof data.status === "boolean"
              ? data.status
              : false
            : false,
          statusCode: data.code
            ? typeof data.code === "number"
              ? data.code
              : 500
            : 500,
          message: data.message || "Oops Something Went Wrong.......",
        };
      } catch (error) {
        console.log("plugin ~ requestResponse ~ error ~ error:", error);
        throw new Error(error);
      }
    },
  });

  // env file configuration
  server.decorate("config", {
    env: config.envConfig,
  });

  // Cron to delete old log files
  cron.schedule(
    "30 * * * *",
    () => {
      const maxTimeMs = moment().subtract(1, "days").endOf("day").format("x");

      console.log("aaaaaaa");
      // Read the files from the source directory
      const exportedFileFilesAll = fs.readdirSync("storage");

      let exportedFiles = [];
      exportedFileFilesAll.map(async (file) => {
        const fileStat = fs.statSync(`storage/${file}`);
        if (maxTimeMs - fileStat.birthtimeMs > 1800000)
          exportedFiles.push(file);
      });

      // Delete Old Exported Files
      for (const file of exportedFiles) {
        fs.unlink(`storage/${file}`, function (err) {
          if (err && err.code == "ENOENT") {
            // file doens't exist
            console.info("File doesn't exist, won't remove it.");
          } else if (err) {
            // other errors, e.g. maybe we don't have enough permission
            console.error("Error occurred while trying to remove file");
          }
        });
      }
    },
    {
      scheduled: server.config.env.CRON_STATUS,
    }
  );

  if (!fs.existsSync(path.join("storage"))) fs.mkdirSync(path.join("storage"));

  // jwt authentication
  server.register(jwt);
  server.register(userAuthorization);

  // database connection
  server.register(database);

  // register all routes
  server.register(autoLoad, {
    dir: join(__dirname, "../routes"),
    dirNameRoutePrefix: false,
    options: { prefix: "/api/v1" },
  });
}

module.exports = fp(plugin);

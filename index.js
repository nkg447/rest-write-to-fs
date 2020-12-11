#!/usr/bin/env node

const arg = require("arg");
const restify = require("restify");
const errs = require("restify-errors");
const path = require("path");
const fs = require("fs");

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--port": String,
      "--folder": String,
      "-p": "--port",
      "-f": "--folder",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    port: args["--port"] || "8000",
    folder: args["--folder"] || process.cwd(),
  };
}

function cli(args) {
  let options = parseArgumentsIntoOptions(args);

  const server = restify.createServer();
  server.use(restify.plugins.queryParser());
  server.use(
    restify.plugins.bodyParser({
      mapParams: true,
    })
  );
  server.use(restify.plugins.acceptParser(server.acceptable));

  const append = (req, res, next) => {
    if (req.query && req.query.file) {
      const file = path.join(options.folder, req.query.file);
      if (req.body && req.body.length > 0) {
        const data = req.body;
        fs.appendFile(file, data, function (err) {
          if (err) {
            next(
              new errs.InternalServerError("Unable to complete the request")
            );
          }
          res.send("Success");
        });
      } else {
        next(new errs.BadRequestError("Empty request body"));
      }
    } else {
      next(new errs.BadRequestError("file query param missing"));
    }
  };

  const write = (req, res, next) => {
    if (req.query && req.query.file) {
      const file = path.join(options.folder, req.query.file);
      if (req.body && req.body.length > 0) {
        const data = req.body;
        fs.writeFile(file, data, function (err) {
          if (err) {
            next(
              new errs.InternalServerError("Unable to complete the request")
            );
          }
          res.send("Success");
        });
      } else {
        next(new errs.BadRequestError("Empty request body"));
      }
    } else {
      next(new errs.BadRequestError("file query param missing"));
    }
  };

  server.post("/append", append);
  server.post("/write", write);

  server.listen(options.port, function () {
    console.log("rest-write-to-fs listening at ");
    console.log(
      "\x1b[32m",
      `\thttp://localhost:${options.port} \n\thttp://127.0.0.1:${options.port}`
    );
  });
}

cli(process.argv);

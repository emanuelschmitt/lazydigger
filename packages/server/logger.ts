import fs from "fs";

import pinoms from "pino-multi-stream";

const prettyStream = pinoms.prettyStream({
  prettyPrint: {
    translateTime: true,
    colorize: true,
    ignore: "pid,hostname,tags",
  },
});

const logger = pinoms({
  streams: [
    { stream: prettyStream, level: "debug" },
    { stream: fs.createWriteStream("logs"), level: "info" },
  ],
});

export default logger;

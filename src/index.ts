/* eslint-disable */
import "reflect-metadata";
require("module-alias").addAlias("#", __dirname);

import { server } from "#/server";
import { Settings } from "#/settings";

const port = new Settings().applicationPort();

server.listen(port, () => {
  console.info(`Server running on port ${port}`);
});
/* eslint-enable */

import "reflect-metadata";
import path from "path";

import moduleAlias from "module-alias";

moduleAlias.addAlias("#", path.join(__dirname, "../src"));
moduleAlias.addAlias("!tests", __dirname);

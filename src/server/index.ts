import express from "express";
import { StatusCodes } from "http-status-codes";
import { useContainer, useExpressServer } from "routing-controllers";

import { apiContainer } from "#/di-container";

const server = express();

useContainer(apiContainer);
useExpressServer(server);

server.get("/", (_req, res) => res.status(StatusCodes.OK).send({ message: "It's work!"}));

export { server };

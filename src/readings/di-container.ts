import { Container } from "inversify";

import { ReadingsController } from "#/readings/infrastructure/readings-controller";

const readingsContainer = new Container();

readingsContainer.bind(ReadingsController).toSelf();

export { readingsContainer };

import { Container } from "inversify";

import { MeasureController } from "#/measure/infrastructure/measure-controller";

const measureContainer = new Container();

measureContainer.bind(MeasureController).toSelf();

export { measureContainer };

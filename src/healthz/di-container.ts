import { Container } from "inversify";

import { HealthzController } from "#/healthz/infrastructure/healthz-controller";

const healthzContainer = new Container();

healthzContainer.bind(HealthzController).toSelf();

export { healthzContainer };

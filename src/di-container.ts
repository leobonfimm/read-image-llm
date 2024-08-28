import { Container, interfaces } from "inversify";

import { healthzContainer } from "#/healthz/di-container";

let apiContainer: interfaces.Container = new Container();

apiContainer = Container.merge(apiContainer, healthzContainer);

export { apiContainer };

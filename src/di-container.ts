import { Container, interfaces } from "inversify";

import { customerContainer } from "#/customer/di-container";
import { healthzContainer } from "#/healthz/di-container";
import { measureContainer } from "#/measure/di-container";

let apiContainer: interfaces.Container = new Container();

apiContainer = Container.merge(apiContainer, healthzContainer, measureContainer, customerContainer);

export { apiContainer };

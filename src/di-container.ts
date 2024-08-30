import { Container, interfaces } from "inversify";

import { customerContainer } from "#/customer/di-container";
import { measureContainer } from "#/measure/di-container";

let apiContainer: interfaces.Container = new Container();

apiContainer = Container.merge(apiContainer, measureContainer, customerContainer);

export { apiContainer };

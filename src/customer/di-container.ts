import { Container } from "inversify";

import { CustomerController } from "#/customer/infrastructure/customer-controller";

const customerContainer = new Container();

customerContainer.bind(CustomerController).toSelf();

export { customerContainer };

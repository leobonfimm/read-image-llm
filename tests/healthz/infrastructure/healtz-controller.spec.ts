import { expect } from "chai";
import { createResponse, MockResponse } from "node-mocks-http";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { HealthzController } from "#/healthz/infrastructure/healthz-controller";
describe("Healthzcontroller", () => {
  it("Should return OK", async () => {
    const response: MockResponse<Response> = createResponse();
    const controller = new HealthzController();

    await controller.healthz(response);

    expect(response.statusCode).to.eq(StatusCodes.OK);
  });
});

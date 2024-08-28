import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { injectable } from "inversify";
import { Get, JsonController, Res } from "routing-controllers";

@injectable()
@JsonController()
export class HealthzController {
  @Get("/healthz")
  public async healthz(@Res() res: Response): Promise<Response> {
    return res.status(StatusCodes.OK).send();
  }
}

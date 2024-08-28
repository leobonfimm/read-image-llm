import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { injectable } from "inversify";
import { Get, JsonController, Param, QueryParam, Res } from "routing-controllers";

@injectable()
@JsonController()
export class MeasureController {
  @Get("/measure/:customerCode/list")
  public async getReadings(
    @Param("customerCode") customerCode: number,
    @Res() res: Response,
    @QueryParam("measure_type") measureType?: "WATER" | "GAS"
  ): Promise<Response> {
    return res.status(StatusCodes.OK)
      .send({
        message: `Return all reading from a client with this ${customerCode} and this query param ${measureType}`,
      });
  }
}

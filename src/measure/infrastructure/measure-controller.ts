import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { injectable } from "inversify";
import { Body, Get, JsonController, Param, Patch, Post, QueryParam, Res } from "routing-controllers";
import { z } from "zod";

import { readMeasure } from "#/lib/gemini";
import { prisma } from "#/lib/prisma";
import { MeasureConfirmRequest, MeasureCreateRequest } from "#/measure/@types/measure";

const registerBodySchema = z.object({
  image: z.string(),
  customer_code: z.string(),
  measure_datetime: z.string().transform((value) => new Date(value)),
  measure_type: z.enum(["WATER", "GAS"]),
});

const confirmBodySchema = z.object({
  measure_uuid: z.string(),
  confirmed_value: z.number(),
});

@injectable()
@JsonController()
export class MeasureController {
  @Post("/measure/upload")
  public async upload(
    @Body() measure: MeasureCreateRequest,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const {
        image,
        customer_code: customerCode,
        measure_datetime: measureDateTime,
        measure_type: measureType,
      } = registerBodySchema.parse(measure);

      const customer = await prisma.customer.findFirst({
        where: { id: customerCode },
      });

      if (!customer) {
        return res.status(StatusCodes.BAD_REQUEST)
          .send({
            "error_description": "customer does not exist or is not registered",
          });
      }

      const measureExists = await prisma.measure.findFirst({
        where: {
          datetime: measureDateTime,
        },
      });

      if (measureExists) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          "error_description": "There is already a reading for this type of current month.",
        });
      }

      const { measureValue, measureDate } = await readMeasure(image);

      await prisma.measure.create({
        data: {
          image,
          datetime: new Date(measureDate),
          type: measureType,
          value: measureValue,
          customerId: customerCode,
        },
      });

      return res.status(StatusCodes.CREATED).send();
    } catch {
      return res.status(StatusCodes.BAD_REQUEST).send({
        "error_description": "The data provided in the request body is invalid.",
      });
    }
  }

  @Get("/measure/:customerCode/list")
  public async getMeasures(
    @Param("customerCode") customerCode: string,
    @Res() res: Response,
    @QueryParam("measure_type") measureTypeRequest?: "WATER" | "GAS"
  ): Promise<Response> {
    const { success } = z.enum(["WATER", "GAS"]).safeParse(measureTypeRequest);

    if (!success) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        "error_description": "Tipo de medição não permitida.",
      });
    }

    const customer = await prisma.customer.findFirst({
      where: { id: customerCode },
    });

    if (!customer) {
      return res.status(StatusCodes.BAD_REQUEST)
        .send({
          "error_description": "customer does not exist or is not registered",
        });
    }

    const measures = await prisma.measure.findMany({
      where: {
        customerId: customerCode,
        type: measureTypeRequest,
      },
    });

    if (measures.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).send({
        "error_description": "Nenhuma leitura encontrada",
      });
    }

    return res.status(StatusCodes.OK).send(measures);
  }

  @Patch("/measure/confirm")
  public async confirm(
    @Body() measureConfirm: MeasureConfirmRequest,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const {
        measure_uuid: measureId,
        confirmed_value: confirmedValue,
      } = confirmBodySchema.parse(measureConfirm);

      const measure = await prisma.measure.findFirst({
        where: {
          id: measureId,
        },
      });

      if (!measure) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          "error_description": "Leitura não encontrada.",
        });
      }

      if (measure.has_confirmed) {
        return res.status(StatusCodes.CONFLICT).send({
          "error_description": "Leitura do mês já realizada.",
        });
      }

      await prisma.measure.update({
        where: {
          id: measureId,
        },
        data: {
          value: confirmedValue,
          has_confirmed: true,
        },
      });

      return res.status(StatusCodes.OK).send({ "success": true });
    } catch {
      return res.status(StatusCodes.BAD_REQUEST).send({
        "error_description": "Os dados fornecidos no corpo da requisição são inválidos.",
      });
    }
  }
}

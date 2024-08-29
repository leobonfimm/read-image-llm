import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { injectable } from "inversify";
import { Body, Delete, Get, JsonController, Param, Post, Put, Res } from "routing-controllers";
import { z } from "zod";

import { Customer } from "#/customer/@types/customer";
import { prisma } from "#/lib/prisma";

@injectable()
@JsonController()
export class CustomerController {
  @Post("/customer")
  public async createCustomer(@Body() customer: Customer, @Res() res: Response): Promise<Response> {
    try {
      const registerBodySchema = z.object({
        name: z.string(),
      });

      const { name } = registerBodySchema.parse(customer);

      await prisma.customer.create({
        data: {
          name,
        },
      });

      return res.status(StatusCodes.CREATED).send();
    } catch {
      return res.status(StatusCodes.BAD_REQUEST).send({
        "error_description": "Missing params",
      });
    }
  }

  @Get("/customer")
  public async getAll(@Res() res: Response): Promise<Response> {
    const users = await prisma.customer.findMany();
    return res.status(StatusCodes.OK).send(users);
  }

  @Get("/customer/:id")
  public async getById(@Param("id") id: string, @Res() res: Response): Promise<Response> {
    const user = await prisma.customer.findFirst({
      where: {
        id,
      },
    });
    return res.status(StatusCodes.OK).send(user);
  }

  @Put("/customer/:id")
  public async updateCustomer(
    @Param("id") id: string,
    @Body() customer: Customer,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const registerBodySchema = z.object({
        name: z.string(),
      });
      const { name } = registerBodySchema.parse(customer);

      await prisma.customer.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

      return res.status(StatusCodes.CREATED).send();
    } catch {
      return res.status(StatusCodes.BAD_REQUEST).send();
    }
  }

  @Delete("/customer/:id")
  public async delete(@Param("id") id: string, @Res() res: Response): Promise<Response> {
    await prisma.customer.delete({
      where: {
        id,
      },
    });
    return res.status(StatusCodes.NO_CONTENT).send();
  }
}

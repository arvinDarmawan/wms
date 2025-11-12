import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

export interface ErrorResponseFormat {
  isSuccess: boolean;
  message: string;
  data?: any;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    //log request later

    let status: number;
    let message: string;
    let meta: Record<string, any> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === "string") {
        message = res;
      } else if (typeof res === "object" && res !== null) {
        message = (res as any).message || "An error occurred";
        meta = (res as any).meta;
      } else {
        message = "An error occurred";
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = "Internal server error";
    }

    const errorResponse: ErrorResponseFormat = {
      isSuccess: false,
      message,
      data: null,
    };

    response.status(status).json(errorResponse);
  }
}

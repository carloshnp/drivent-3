import { AuthenticatedRequest } from "./authentication-middleware";
import { NextFunction, Response } from "express";
import ticketService from "@/services/tickets-service";
import httpStatus from "http-status";

export async function validateUserTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const userTicket = ticketService.getTicketByUserId(userId);
    res.locals.ticket = userTicket;
    next();
  } catch (err) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function validatePaidTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { ticket } = res.locals;
  if(ticket.status === "RESERVED") {
    return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
  }
  try {
    const ticketType = await ticketService.findTickeWithTypeById(ticket.id);
    if (!ticketType.TicketType.includesHotel || ticketType.TicketType.isRemote) {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    next();
  } catch (err) {
    return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
  }
}

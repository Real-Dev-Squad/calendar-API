// Define the interfaces to be used for the API responses
import { Payload } from "@hapi/boom";
import {Calendar } from "@prisma/client";

interface apiResponse<ResponseType> extends ResponseType {
  message?: string;
  data?: ResponseType;
  error?: Payload;
}

interface healthResponse {
  version: string;
  uptime: number;
}

interface calendarResponse {
  rCal: rCalData[];
  externalCalendars: externalCalendar[]
}

interface rCalData {
  id: number;
  name: string;
  ownerId: number;
  isPrimary: boolean;
}

interface externalCalendar extends Omit<Calendar, 'deleted', 'ownerId', 'isDeleted'> {}

interface usernameAvailabilityResponse {
  username: string;
  available: boolean;
}

export {
  healthResponse,
  apiResponse,
  calendarResponse,
  rCalData,
  externalCalendar,
  usernameAvailabilityResponse,
};

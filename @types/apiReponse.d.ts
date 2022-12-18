// Define the interfaces to be used for the API responses

import { Payload } from "@hapi/boom";

interface healthResponse {
  version: string;
  uptime: number;
}

interface CalendarResponse {
  id: number;
  name: string;
  ownerId: number;
  isDeleted: boolean;
}

interface apiResponse<ResponseType> extends ResponseType {
  message?: string;
  data?: ResponseType;
  error?: Payload;
}

export { healthResponse, apiResponse, CalendarResponse };

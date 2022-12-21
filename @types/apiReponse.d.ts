// Define the interfaces to be used for the API responses

import { Payload } from "@hapi/boom";

interface apiResponse<ResponseType> extends ResponseType {
  message?: string;
  data?: ResponseType;
  error?: Payload;
}

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


interface usernameAvailability {
  username: string;
  available: boolean;
}

export { healthResponse, apiResponse, CalendarResponse, usernameAvailability };

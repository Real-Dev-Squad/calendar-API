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

interface calendarResponse {
  id: number;
  name: string;
  ownerId: number;
  isPrimary: boolean;
}

interface usernameAvailabilityResponse {
  username: string;
  available: boolean;
}

export {
  healthResponse,
  apiResponse,
  calendarResponse,
  usernameAvailabilityResponse,
};

// Define the interfaces to be used for the API responses

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

export { healthResponse, CalendarResponse };

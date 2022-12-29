import { ChildEvent, ParentEvent } from "@prisma/client";
import {
  childEventWithAttendees,
  parentEventWithChildEventRecurringEventEventType,
} from "../@types/services";

const formateParentEventForResponse = (
  event: parentEventWithChildEventRecurringEventEventType | null
): any => {
  const { ChildEvent, EventType, RecurringEvent, ...parentEvent } = event ?? {};
  const { id, name, description, calendarId } = parentEvent as ParentEvent;
  const [childEvent] = ChildEvent ?? [];
  const { location, startTime, endTime, Attendees } =
    childEvent as childEventWithAttendees;
  const [recurring] = RecurringEvent ?? [];

  const attendees = Attendees?.map((attendee: any) => attendee.attendee.email);

  const formattedData = {
    id,
    name,
    description,
    eventType: EventType?.name,
    location,
    startTime,
    endTime,
    calendarId,
    attendees,
    recurring,
  };

  return formattedData;
};

const formateChildEventForResponse = (event: any): any => {
  const { ParentEvent, Attendees, ...childEvent } = event ?? {};
  const { id, name, description, calendarId, location, startTime, endTime } =
    childEvent as ChildEvent;
  const { RecurringEvent } = ParentEvent ?? {};
  const [recurring] = RecurringEvent ?? [];

  const attendees = Attendees?.map((attendee: any) => attendee.attendee.email);

  const formattedData = {
    id,
    name,
    description,
    location,
    startTime,
    endTime,
    calendarId,
    attendees,
    recurring,
  };

  return formattedData;
};
const formateChildEventFromCalendarForResponse = (events: any): any => {
  const formattedEvent = events.map((event: any) => {
    return formateChildEventForResponse(event);
  });

  return formattedEvent;
};

export {
  formateParentEventForResponse,
  formateChildEventForResponse,
  formateChildEventFromCalendarForResponse,
};

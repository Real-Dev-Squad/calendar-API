import { ParentEvent } from "@prisma/client";
import {
  childEventWithAttendees,
  parentEventWithChildEventRecurringEventEventType,
} from "../@types/services";

const formateParentEvent = (
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

export { formateParentEvent };

import {
  Attendees,
  ChildEvent,
  EventType,
  ParentEvent,
  RecurringEvent,
} from "@prisma/client";

// Add types for service
interface jwtPayload {
  userId: number;
}

interface parentEventWithChildEventRecurringEventEventType extends ParentEvent {
  ChildEvent: ChildEvent[];
  RecurringEvent: RecurringEvent[];
  EventType: EventType;
}

interface childEventWithAttendees extends ChildEvent {
  Attendees?: Attendees[];
}

export {
  jwtPayload,
  parentEventWithChildEventRecurringEventEventType,
  childEventWithAttendees,
};

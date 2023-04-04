import { getTimeZones as tzdbGetTimeZones } from '@vvo/tzdb';

const getTimeZones = (
  userTimeZone: string
): {
  timeZones: Array<{
    label: string;
    value: string;
  }>;
  userTimeZoneIndex: number | undefined;
} => {
  const rawOptions = tzdbGetTimeZones({ includeUtc: true });

  let userTimeZoneIndex;

  const timeZonesArray = rawOptions.map((timeZone, index) => {
    if (timeZone.name === userTimeZone) {
      userTimeZoneIndex = index;
    }
    const cities = timeZone.mainCities.join(', ');
    const utcOffset = timeZone.currentTimeFormat.substring(0, 6);
    return {
      label: `${cities} - ${timeZone.alternativeName} (GMT ${utcOffset})`,
      value: timeZone.name,
    };
  });

  return { timeZones: timeZonesArray, userTimeZoneIndex };
};

export { getTimeZones };

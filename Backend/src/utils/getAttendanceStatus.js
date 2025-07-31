const DEFAULT_START_TIME = "09:00";
const DEFAULT_END_TIME = "17:00";
const LATE_TOLERANCE_MINUTES = 15;
const HALF_DAY_LIMIT_HOUR = 12;

export function isLatet(checkInTime) {
  const [startHourLocal, startMinLocal] = DEFAULT_START_TIME.split(":").map(Number);
  const tolerance = LATE_TOLERANCE_MINUTES;

  const expectedStartHourUTC = startHourLocal - 7;

  const expectedTime = new Date(checkInTime);
  expectedTime.setUTCHours(expectedStartHourUTC, startMinLocal, 0, 0);

  const allowedLatest = new Date(expectedTime.getTime() + tolerance * 60000);

  return checkInTime > allowedLatest;
}

export function getAttendanceStatus(checkIn, checkOut) {
  if (!checkIn) {
    return "Tidak Ada Check-in";
  }

  const didCheckInLate = isLatet(checkIn);

  if (!checkOut) {
    return didCheckInLate ? "Present (Late)" : "Present";
  }

  const workedHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);

  const fullDayThreshold = 6.5;
  const halfDayThreshold = 4;

  let status = "Unknown";

  if (workedHours >= fullDayThreshold) {
    status = "Full Day";
  } else if (workedHours >= halfDayThreshold) {
    status = "Half Day";
  } else if (checkIn.getHours() >= HALF_DAY_LIMIT_HOUR) {
    status = "Half Day";
  } else {
    status = "Half Day";
  }

  if (didCheckInLate) {
    return `${status} (Late)`;
  }

  return status;
}
export function isLatet(checkInTime) {
  const [startHourLocal, startMinLocal] = process.env.DEFAULT_START_TIME.split(":").map(Number);
  const tolerance = parseInt(process.env.LATE_TOLERANCE_MINUTES || "0");

  const expectedStartHourUTC = startHourLocal - 7;

  const expectedTime = new Date(checkInTime);
  expectedTime.setUTCHours(expectedStartHourUTC, startMinLocal, 0, 0);

  const allowedLatest = new Date(expectedTime.getTime() + tolerance * 60000);

  return checkInTime > allowedLatest;
}

export function getAttendanceStatus(checkIn, checkOut) {
  const [startHour, startMin] = process.env.DEFAULT_START_TIME.split(":").map(Number);
  const [endHour, endMin] = process.env.DEFAULT_END_TIME.split(":").map(Number);
  const halfDayLimitHour = parseInt(process.env.HALF_DAY_LIMIT_HOUR || "12");

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
  } else if (checkIn.getHours() >= halfDayLimitHour) {
    status = "Half Day";
  } else {
    status = "Half Day";
  }

  if (didCheckInLate) {
    return `${status} (Late)`;
  }

  return status;
}
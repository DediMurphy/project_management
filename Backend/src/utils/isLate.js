export function isLate(checkInTime) {
  const [hour, minute] = process.env.DEFAULT_START_TIME.split(":").map(Number);
  const tolerance = parseInt(process.env.LATE_TOLERANCE_MINUTES || "0");

  const expectedTime = new Date(checkInTime);
  expectedTime.setHours(hour, minute, 0, 0);

  const allowedLatest = new Date(expectedTime.getTime() + tolerance * 60000);

  return checkInTime > allowedLatest;
}

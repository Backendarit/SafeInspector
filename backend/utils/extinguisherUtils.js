// Calculates the next inspection date based on last inspection and interval.

function calculateNextInspection(lastInspection, intervalYears) {
  const next = new Date(lastInspection);
  next.setFullYear(next.getFullYear() + parseInt(intervalYears));
  return next.toISOString().split("T")[0];
}

// Calculates the service due date (manufacture date + 10 years).
// Uses last inspection month/day for realism.

function calculateServiceDueDate(manufactureYear, lastInspection) {
  const refDate = new Date(lastInspection || `${manufactureYear}-01-01`);
  refDate.setFullYear(parseInt(manufactureYear) + 10);
  return refDate.toISOString().split("T")[0];
}

// Status: "OK", "Inspection Due", "Service Due", "Late"

function calculateExtinguisherStatus(ext) {
  const today = new Date();
  const nextInspection = new Date(ext.nextInspection);
  const serviceDue = new Date(ext.serviceDue);

  if (today > serviceDue) return "Late";
  if (today > nextInspection) return "Inspection Due";

  // Within the same month as inspection or service
  if (
    today.getFullYear() === nextInspection.getFullYear() &&
    today.getMonth() === nextInspection.getMonth()
  ) {
    return "Inspection Due";
  }
  if (
    today.getFullYear() === serviceDue.getFullYear() &&
    today.getMonth() === serviceDue.getMonth()
  ) {
    return "Service Due";
  }
  return "OK";
}

// Checks if next inspection would go past service due.

function isInspectionBlocked(ext) {
  const nextYear = parseInt(ext.nextInspection.slice(0, 4));
  const dueYear = parseInt(ext.serviceDue.slice(0, 4));
  return nextYear > dueYear;
}

module.exports = {
  calculateNextInspection,
  calculateServiceDueDate,
  calculateExtinguisherStatus,
  isInspectionBlocked,
};

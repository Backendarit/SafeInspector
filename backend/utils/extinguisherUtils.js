// Sorting Months
const sameMonth = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const beforeMonth = (a, b) =>
  a.getFullYear() < b.getFullYear() ||
  (a.getFullYear() === b.getFullYear() && a.getMonth() < b.getMonth());

const afterMonth = (a, b) =>
  a.getFullYear() > b.getFullYear() ||
  (a.getFullYear() === b.getFullYear() && a.getMonth() > b.getMonth());

// Calculates the next inspection date based on last inspection and interval.
function calculateNextInspection(lastInspection, intervalYears) {
  const next = new Date(lastInspection);
  next.setFullYear(next.getFullYear() + parseInt(intervalYears, 10));
  return next.toISOString().split("T")[0];
}

// Calculates the service due date (manufacture date + 10 years).
function calculateServiceDueDate(manufactureYear, lastInspection) {
  const refDate = new Date(lastInspection || `${manufactureYear}-01-01`);
  refDate.setFullYear(parseInt(manufactureYear, 10) + 10);
  return refDate.toISOString().split("T")[0];
}

// Checks if next inspection would go past service due.
function isInspectionBlocked(ext) {
  const next = new Date(ext.nextInspection);
  const due = new Date(ext.serviceDue);
  return next > due;
}


// Status: "OK", "Inspection Due", "Service Due", "Late"
function calculateExtinguisherStatus(ext) {
  const today = new Date();
  const nextInspection = new Date(ext.nextInspection);
  const serviceDue = new Date(ext.serviceDue);

  const sameMonthAsNext = sameMonth(today, nextInspection);
  const sameYearAsServiceDue =
    nextInspection.getFullYear() === serviceDue.getFullYear();

  // Status: Service Due
  if (sameMonth(today, serviceDue)) return "Service Due";
  if (sameMonthAsNext && (sameYearAsServiceDue || isInspectionBlocked(ext))) {
    return "Service Due";
  }

  // Status: Inspection Due
  if (sameMonthAsNext) return "Inspection Due";

  // Status: Late
  if (afterMonth(today, nextInspection)) return "Late";
  if (afterMonth(today, serviceDue)) return "Late";

  // Status: OK
  if (beforeMonth(today, nextInspection)) return "OK";

  return "OK";
}

module.exports = {
  calculateNextInspection,
  calculateServiceDueDate,
  calculateExtinguisherStatus,
  isInspectionBlocked,
};

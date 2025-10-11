const {
  calculateNextInspection,
  calculateServiceDueDate,
  calculateExtinguisherStatus,
  isInspectionBlocked,
} = require("../utils/extinguisherUtils");

class Extinguisher {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.type = data.type;
    this.location = data.location;
    this.manufactureYear = parseInt(data.manufactureYear);
    this.intervalYears = parseInt(data.intervalYears || 2);
    this.lastInspection = data.lastInspection || new Date().toISOString().split("T")[0];
    this.notes = data.notes || "";
    this.status = "OK";

    // Calculations
    this.nextInspection = calculateNextInspection(this.lastInspection, this.intervalYears);
    this.serviceDue = calculateServiceDueDate(this.manufactureYear, this.lastInspection);

    // If inspection would go past service due, block creation
    if (isInspectionBlocked(this)) {
      throw new Error(
        `Cannot add extinguisher: next inspection exceeds service due (${this.serviceDue}).`
      );
    }

    this.status = calculateExtinguisherStatus(this);
  }

  updateInspection() {
    this.lastInspection = new Date().toISOString().split("T")[0];
    this.nextInspection = calculateNextInspection(this.lastInspection, this.intervalYears);
    this.serviceDue = calculateServiceDueDate(this.manufactureYear, this.lastInspection);
    this.status = calculateExtinguisherStatus(this);
  }

  refreshStatus() {
    this.status = calculateExtinguisherStatus(this);
  }
}

module.exports = Extinguisher;

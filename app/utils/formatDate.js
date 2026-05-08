const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
});

const toValidDate = (value) => {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDateTime = (value) => {
  const date = toValidDate(value);

  if (!date) {
    return "-";
  }

  return dateFormatter.format(date);
};

export const getScheduleState = (startTime, endTime, now = new Date()) => {
  const start = toValidDate(startTime);
  const end = toValidDate(endTime);

  if (!start || !end || end <= start) {
    return "invalid";
  }

  if (now < start) {
    return "scheduled";
  }

  if (now > end) {
    return "expired";
  }

  return "active";
};

export const getScheduleLabel = (startTime, endTime) => {
  const state = getScheduleState(startTime, endTime);

  if (state === "scheduled") {
    return "Scheduled";
  }

  if (state === "active") {
    return "Active";
  }

  if (state === "expired") {
    return "Expired";
  }

  return "Invalid";
};

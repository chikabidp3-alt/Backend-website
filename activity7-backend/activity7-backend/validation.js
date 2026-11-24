const allowedStatuses = ["Pending", "In progress", "Completed"];

function parseId(value) {
  if (!/^\d+$/.test(String(value)) || Number(value) < 1 || !Number.isSafeInteger(Number(value))) {
    return null;
  }
  return Number(value);
}

function validateRecord(body) {
  const fields = [
    ["title", 3, 80, "Title"],
    ["category", 2, 40, "Category"],
    ["description", 5, 300, "Description"]
  ];
  const record = {};

  for (const [key, min, max, label] of fields) {
    if (!body || typeof body[key] !== "string") {
      return { error: `${label} is required and must be text.` };
    }
    const value = body[key].trim();
    if (value.length < min || value.length > max) {
      return { error: `${label} must have ${min} to ${max} characters.` };
    }
    record[key] = value;
  }

  if (!body || typeof body.status !== "string") {
    return { error: "Status is required and must be text." };
  }
  record.status = body.status.trim();
  if (!allowedStatuses.includes(record.status)) {
    return { error: "Status must be Pending, In progress, or Completed." };
  }
  return { record };
}

module.exports = { allowedStatuses, parseId, validateRecord };

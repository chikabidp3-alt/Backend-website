const test = require("node:test");
const assert = require("node:assert/strict");
const { parseId, validateRecord } = require("../validation");

const valid = { title: "Broken classroom light", category: "Electrical", description: "The light in Room B12 does not switch on.", status: "Pending" };

test("accepts and trims a valid record", () => {
  const result = validateRecord({ ...valid, title: "  Broken classroom light  " });
  assert.equal(result.record.title, "Broken classroom light");
});
test("rejects an unknown status", () => assert.match(validateRecord({ ...valid, status: "Open" }).error, /Status must/));
test("rejects short titles", () => assert.match(validateRecord({ ...valid, title: "No" }).error, /Title must/));
test("only permits positive whole number ids", () => {
  assert.equal(parseId("12"), 12);
  assert.equal(parseId("0"), null);
  assert.equal(parseId("1.5"), null);
});

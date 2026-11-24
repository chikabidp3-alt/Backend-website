const router = require("express").Router();
const pool = require("../db");
const { parseId, validateRecord } = require("../validation");

function requireValidId(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: "Id must be a positive whole number." });
    return null;
  }
  return id;
}

router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, title, category, description, status FROM records ORDER BY id"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = requireValidId(req, res);
  if (id === null) return;
  try {
    const result = await pool.query(
      "SELECT id, title, category, description, status FROM records WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: "Record not found." });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const validated = validateRecord(req.body);
  if (validated.error) return res.status(400).json({ message: validated.error });
  const { title, category, description, status } = validated.record;
  try {
    const result = await pool.query(
      "INSERT INTO records (title, category, description, status) VALUES ($1, $2, $3, $4) RETURNING id, title, category, description, status",
      [title, category, description, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const id = requireValidId(req, res);
  if (id === null) return;
  const validated = validateRecord(req.body);
  if (validated.error) return res.status(400).json({ message: validated.error });
  const { title, category, description, status } = validated.record;
  try {
    const result = await pool.query(
      "UPDATE records SET title = $1, category = $2, description = $3, status = $4 WHERE id = $5 RETURNING id, title, category, description, status",
      [title, category, description, status, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: "Record not found." });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = requireValidId(req, res);
  if (id === null) return;
  try {
    const result = await pool.query("DELETE FROM records WHERE id = $1 RETURNING id", [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: "Record not found." });
    res.status(200).json({ message: "Record deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

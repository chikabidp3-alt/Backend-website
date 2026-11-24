require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const { allowedStatuses } = require("./validation");

const app = express();
const origins = (process.env.CLIENT_ORIGINS || "")
  .split(",").map((value) => value.trim()).filter(Boolean);
const projectName = process.env.PROJECT_NAME || "Campus Maintenance Request System API";
const studentNumber = process.env.STUDENT_NUMBER || "Not yet configured";
const baseUrl = process.env.API_BASE_URL || "http://localhost:" + (process.env.PORT || 3000);

app.use(cors({ origin: origins.length ? origins : true }));
app.use(express.json());

app.get("/", (req, res) => {
  const body = JSON.stringify({
    title: "Broken classroom light",
    category: "Electrical",
    description: "The light in Room B12 does not switch on.",
    status: "Pending"
  }, null, 2);
  res.status(200).type("html").send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${projectName}</title><style>body{font-family:system-ui,sans-serif;max-width:900px;margin:40px auto;padding:0 20px;line-height:1.5;color:#18212f}code,pre{background:#f2f5f8;border-radius:6px;padding:2px 5px}pre{padding:16px;overflow:auto}table{width:100%;border-collapse:collapse}th,td{border:1px solid #d7dce2;padding:10px;text-align:left}th{background:#f2f5f8}a{color:#0756ad}</style></head><body><h1>${projectName}</h1><p><strong>Student number:</strong> ${studentNumber}</p><p>A standalone API for submitting, tracking and managing campus maintenance requests.</p><p><strong>Live base URL:</strong> <a href="${baseUrl}">${baseUrl}</a></p><p><a href="/health">Health check</a> | <a href="/api/records">All records</a></p><h2>Routes</h2><table><tr><th>Method</th><th>Route</th><th>Purpose</th></tr><tr><td>GET</td><td>/</td><td>API guide</td></tr><tr><td>GET</td><td>/health</td><td>Server and database health</td></tr><tr><td>GET</td><td>/api/records</td><td>Read all requests</td></tr><tr><td>GET</td><td>/api/records/:id</td><td>Read one request</td></tr><tr><td>POST</td><td>/api/records</td><td>Create a request</td></tr><tr><td>PUT</td><td>/api/records/:id</td><td>Replace a request</td></tr><tr><td>DELETE</td><td>/api/records/:id</td><td>Delete a request</td></tr></table><h2>Request body</h2><p>Send all four editable fields. Valid statuses: ${allowedStatuses.join(", ")}.</p><pre>${body}</pre><h2>Responses</h2><p>Success: 200, 201. Errors: 400 for invalid input or malformed JSON, 404 for a missing route or record, 500 for an unexpected failure, and 503 if the database is unavailable.</p><p>An idle hosted service may need a short time to start.</p></body></html>`);
});

app.get("/health", async (req, res, next) => {
  try {
    await pool.query("SELECT 1 AS database_ok");
    res.status(200).json({ message: "Server and database are healthy." });
  } catch (error) {
    error.healthCheck = true;
    next(error);
  }
});

app.use("/api/records", require("./routes/records"));

app.use((req, res) => res.status(404).json({ message: "Route not found." }));

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ message: "Malformed JSON request body." });
  }
  console.error(error);
  if (error.healthCheck) return res.status(503).json({ message: "Database is unavailable." });
  res.status(500).json({ message: "An unexpected server error occurred." });
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log(`Server listening on port ${port}`));

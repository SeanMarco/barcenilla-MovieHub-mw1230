// MovieHub server: serves the pages and the CRUD API (Express + MySQL).
const express = require("express");
const mysql = require("mysql2/promise");

// Edit these to match your MySQL setup (XAMPP default: root, no password).
const DB = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "moviehub",
};
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool(DB);
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const SELECT_COLS =
  "id, title, genre, year, status, rating, notes, date_added AS dateAdded";

function clean(d = {}) {
  const status = ["to-watch", "watching", "watched"].includes(d.status)
    ? d.status
    : "to-watch";
  const rating = Math.max(0, Math.min(5, parseInt(d.rating, 10) || 0));
  const year = d.year === "" || d.year == null ? null : parseInt(d.year, 10);
  return [
    String(d.title ?? "").trim(),
    String(d.genre ?? "").trim(),
    Number.isNaN(year) ? null : year,
    status,
    rating,
    String(d.notes ?? "").trim(),
  ];
}

// Read all
app.get("/api/movies", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ${SELECT_COLS} FROM movies ORDER BY date_added DESC, id DESC`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Query failed" });
  }
});

// Read one
app.get("/api/movies/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ${SELECT_COLS} FROM movies WHERE id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json(null);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Query failed" });
  }
});

// Create
app.post("/api/movies", async (req, res) => {
  const v = clean(req.body);
  if (!v[0]) return res.status(400).json({ error: "Title required" });
  try {
    const [r] = await pool.query(
      "INSERT INTO movies (title, genre, year, status, rating, notes) VALUES (?,?,?,?,?,?)",
      v
    );
    res.json({ id: r.insertId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Query failed" });
  }
});

// Update
app.put("/api/movies/:id", async (req, res) => {
  const v = clean(req.body);
  if (!v[0]) return res.status(400).json({ error: "Title required" });
  try {
    await pool.query(
      "UPDATE movies SET title=?, genre=?, year=?, status=?, rating=?, notes=? WHERE id=?",
      [...v, req.params.id]
    );
    res.json({ updated: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Query failed" });
  }
});

// Delete
app.delete("/api/movies/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM movies WHERE id = ?", [req.params.id]);
    res.json({ deleted: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Query failed" });
  }
});

app.listen(PORT, () =>
  console.log(`MovieHub running at http://localhost:${PORT}`)
);

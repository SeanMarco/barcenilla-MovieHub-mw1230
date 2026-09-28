/* ============================================
   Movie Watchlist — shared logic
   Data is stored in MySQL through the Node API (server.js).
   ============================================ */

const API_URL = "/api/movies";

// ---- Data access (talks to the PHP/MySQL API) ----

async function getMovies() {
  const res = await fetch(API_URL);
  return res.ok ? res.json() : [];
}

async function getMovieById(id) {
  const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`);
  return res.ok ? res.json() : null;
}

async function addMovie(movie) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie),
  });
  return res.json();
}

async function updateMovie(id, updates) {
  const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return res.json();
}

async function deleteMovie(id) {
  await fetch(`${API_URL}/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// ---- Formatting helpers ----

function statusLabel(status) {
  return { "to-watch": "To Watch", watching: "Watching", watched: "Watched" }[
    status
  ] || status;
}

function starString(rating) {
  const r = Number(rating) || 0;
  if (r <= 0) return "—";
  return "★".repeat(r) + "☆".repeat(5 - r);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

// ---- Poster tile (small colored initials block, used instead of a real image) ----

const POSTER_PALETTE = [
  "#7b2ff7", "#0f4c81", "#8e0e00", "#1b4332",
  "#6a040f", "#3a0ca3", "#264653", "#7a5c00",
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function posterColor(movie) {
  const seed = `${movie.title}${movie.genre || ""}`;
  return POSTER_PALETTE[hashString(seed) % POSTER_PALETTE.length];
}

function posterInitials(title) {
  const words = (title || "?").trim().split(/\s+/).slice(0, 2);
  return words.map((w) => w[0]).join("").toUpperCase();
}

function posterTile(movie) {
  return `<div class="poster" style="background:${posterColor(movie)}">${posterInitials(
    movie.title
  )}</div>`;
}

// ---- Nav highlighting ----

function highlightActiveNav() {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav.tabs a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === current) a.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  highlightActiveNav();
});

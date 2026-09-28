# MovieHub
MovieHub is a modern movie watchlist and tracking app that helps users discover, organize, and manage their favorite films. Users can browse movies, add titles to their watchlist, track watched movies, and easily edit or remove records—all through a sleek, Netflix-inspired interface.


## Setup
1. Install Node.js and MySQL (XAMPP's MySQL works). Start MySQL.
2. Import `database.sql` (phpMyAdmin > Import, or `mysql -u root < database.sql`).
3. In this folder run `npm install`, then `npm start`.
4. Open `http://localhost:3000`.

If your MySQL login isn't `root` with no password, edit the `DB` block at the top of `server.js`
(or set `DB_USER` / `DB_PASS` environment variables).

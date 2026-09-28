<?php
// CRUD endpoint for movies.
// GET    movies.php          -> list all
// GET    movies.php?id=1     -> one movie
// POST   movies.php          -> create
// PUT    movies.php?id=1     -> update
// DELETE movies.php?id=1     -> delete
header("Content-Type: application/json");
require __DIR__ . "/db.php";

const SELECT_COLS = "id, title, genre, year, status, rating, notes, date_added AS dateAdded";

function clean($d) {
    $status = in_array($d["status"] ?? "", ["to-watch", "watching", "watched"], true)
        ? $d["status"] : "to-watch";
    $rating = max(0, min(5, (int)($d["rating"] ?? 0)));
    $year = isset($d["year"]) && $d["year"] !== "" ? (int)$d["year"] : null;
    return [
        trim($d["title"] ?? ""),
        trim($d["genre"] ?? ""),
        $year,
        $status,
        $rating,
        trim($d["notes"] ?? ""),
    ];
}

$method = $_SERVER["REQUEST_METHOD"];
$id = isset($_GET["id"]) ? (int)$_GET["id"] : null;
$body = json_decode(file_get_contents("php://input"), true) ?? [];

try {
    if ($method === "GET") {
        if ($id) {
            $st = $pdo->prepare("SELECT " . SELECT_COLS . " FROM movies WHERE id = ?");
            $st->execute([$id]);
            $row = $st->fetch();
            if (!$row) { http_response_code(404); echo json_encode(null); exit; }
            echo json_encode($row);
        } else {
            $rows = $pdo->query("SELECT " . SELECT_COLS . " FROM movies ORDER BY date_added DESC, id DESC")->fetchAll();
            echo json_encode($rows);
        }
    } elseif ($method === "POST") {
        $v = clean($body);
        if ($v[0] === "") { http_response_code(400); echo json_encode(["error" => "Title required"]); exit; }
        $st = $pdo->prepare("INSERT INTO movies (title, genre, year, status, rating, notes) VALUES (?,?,?,?,?,?)");
        $st->execute($v);
        echo json_encode(["id" => (int)$pdo->lastInsertId()]);
    } elseif ($method === "PUT" && $id) {
        $v = clean($body);
        if ($v[0] === "") { http_response_code(400); echo json_encode(["error" => "Title required"]); exit; }
        $v[] = $id;
        $st = $pdo->prepare("UPDATE movies SET title=?, genre=?, year=?, status=?, rating=?, notes=? WHERE id=?");
        $st->execute($v);
        echo json_encode(["updated" => true]);
    } elseif ($method === "DELETE" && $id) {
        $st = $pdo->prepare("DELETE FROM movies WHERE id = ?");
        $st->execute([$id]);
        echo json_encode(["deleted" => true]);
    } else {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Query failed"]);
}

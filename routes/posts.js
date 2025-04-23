// Expressを読み込む
const express = require("express");
const router = express.Router();
// DBへ接続
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite");

// 一覧取得 API
router.get("/", (req, res) => {
  db.all("SELECT * FROM posts", (err, rows) => {
    if (err) {
      // エラーが出たら500（サーバーエラー）
      res.status(500).json({ error: "データ取得に失敗しました" });
    } else {
      // 正常ならJSONで記事一覧を返す
      res.json(rows);
    }
  });
});

// 記事詳細取得 API
router.get("/:id", (req, res) => {
  const postId = req.params.id;
  db.get("SELECT * FROM posts WHERE id = ?", [postId], (err, row) => {
    if (err) {
      res.status(500).json({ error: "データ取得に失敗しました" });
    } else if (!row) {
      res.status(404).json({ error: "該当記事が見つかりません" });
    } else {
      res.json(row);
    }
  });
});

module.exports = router;

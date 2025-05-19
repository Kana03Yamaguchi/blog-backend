/**
 * 記事（posts）に関するAPIルーティング
 * - 記事一覧取得：GET /api/posts
 * - 記事詳細取得：GET /api/posts/:id
 * - 記事作成：POST /api/posts
 */

// Expressを読み込む
const express = require("express");
const router = express.Router();
// DBへ接続
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite");

// 記事一覧取得 API：GET
router.get("/", (req, res) => {
  db.all("SELECT * FROM posts", (err, rows) => {
    if (err) {
      res.status(500).json({ error: "データ取得に失敗しました" });
    } else {
      // 正常ならJSONで記事一覧を返す
      res.json(rows);
    }
  });
});

// 記事詳細取得 API：GET
router.get("/:id", (req, res) => {
  const postId = req.params.id;

  db.get("SELECT * FROM posts WHERE id = ?", [postId], (err, row) => {
    if (err) {
      res.status(500).json({ error: "データ取得に失敗しました" });
    } else if (!row) {
      res.status(404).json({ error: "該当記事が見つかりません" });
    } else {
      // 正常ならJSONで記事詳細を返す
      res.json(row);
    }
  });
});

// 記事作成 API：POST
router.post("/", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "タイトルと本文は必須です" });
  }
  // 作成日時を設定
  const createdAt = new Date().toISOString();
  // 更新日時を設定
  const updatedAt = createdAt;

  db.run(
    "INSERT INTO posts (title, content, createdAt, updatedAt) VALUES (?, ?, ?, ?)",
    [title, content, createdAt, updatedAt],
    function (err) {
      if (err) {
        res.status(500).json({ error: "記事作成に失敗しました" });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    }
  );
});

// 記事編集 API：PUT
router.put("/:id", (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "タイトルと本文は必須です" });
  }
  // 更新日時を設定
  const updatedAt = new Date().toISOString();

  db.run(
    "UPDATE posts SET title = ?, content = ?, updatedAt = ? WHERE id = ?",
    [title, content, updatedAt, postId],
    function (err) {
      if (err) {
        res.status(500).json({ error: "記事更新に失敗しました" });
      } else if (this.changes === 0) {
        // 該当するIDが存在しない場合
        res.status(404).json({ error: "該当記事が見つかりません" });
      } else {
        res.json({ message: "記事を更新しました" });
      }
    }
  );
});

// 記事削除 API：DELETE
router.delete("/:id", (req, res) => {
  const postId = req.params.id;

  db.run("DELETE FROM posts WHERE id = ?", [postId], function (err) {
    if (err) {
      res.status(500).json({ error: "記事削除に失敗しました" });
    } else if (this.changes === 0) {
      // 該当するIDが存在しない場合
      res.status(404).json({ error: "該当記事が見つかりません" });
    } else {
      res.json({ message: "記事を削除しました" });
    }
  });
});

// コメント一覧取得 API：GET
router.get("/:id/comments", (req, res) => {
  const postId = req.params.id;

  // 仮のコメントデータを返す
  const dummyComments = [
    {
      id: 1,
      postId: Number(postId),
      name: "ダミー太郎",
      email: "dummy@example.com",
      body: "これは仮のコメントです。",
    },
    {
      id: 2,
      postId: Number(postId),
      name: "仮山 花子",
      email: "kari@example.com",
      body: "テスト中のコメントです。",
    },
  ];
  res.json(dummyComments);
});

module.exports = router;

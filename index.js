// Expressを読み込む
const express = require("express");
// アプリのインスタンスを作成
const app = express();
// ポート番号の設定
const PORT = 3000;

// postsルーターの読み込みを追加
const postsRouter = require("./routes/posts");
// postsルーターを /api/posts に紐づけて登録
app.use("/api/posts", postsRouter);

// ルートパス（"/"）にアクセスしたときのレスポンス定義
app.get("/", (req, res) => {
  res.send("Hello from API!");
});

// sqlite3 を読み込み
const sqlite3 = require("sqlite3").verbose();

// データベースファイルに接続（存在しない場合は自動生成）
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("接続エラー:", err.message);
  } else {
    console.log("データベース接続成功！");
  }

  // テーブル作成
  db.run(`
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )
      `);
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`サーバー起動中：http://localhost:${PORT}`);
});

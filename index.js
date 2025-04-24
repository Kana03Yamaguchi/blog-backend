/**
 * サーバー起動のメインファイル
 * - Express アプリを初期化する
 * - ポートを指定して起動する
 * - ルーター（posts.jsなど）を読み込んで登録する
 * - DB接続やテーブル初期化など、全体に関わる処理
 */

// Expressを読み込む
const express = require("express");
// アプリのインスタンスを作成
const app = express();
// ポート番号の設定
const PORT = 3000;

// postsルーターの読み込みを追加
const postsRouter = require("./routes/posts");
// リクエストボディをJSON形式に変換
app.use(express.json());
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
    console.log("データベース接続成功");
  }

  // テーブル作成
  db.run(`
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL, -- タイトル
          content TEXT NOT NULL, -- 本文
          createdAt TEXT NOT NULL, -- 作成日時
          updatedAt TEXT NOT NULL -- 更新日時
        )
      `);
});

db.get(
  `
  SELECT COUNT(*) AS count FROM posts
  `,
  (err, row) => {
    if (err) {
      console.error("件数取得エラー:", err.message);
    } else if (row.count === 0) {
      db.run(
        `
        INSERT INTO posts (title, content, createdAt, updatedAt)
        VALUES ('初めての投稿', 'これは初めての投稿です。', datetime('now'), datetime('now')) 
        `,
        (inserterr) => {
          if (inserterr) {
            console.error("初期データ挿入エラー:", inserterr.message);
          } else {
            console.log("初期データ挿入成功");
          }
        }
      );
    }
  }
);

// サーバーを起動
app.listen(PORT, () => {
  console.log(`サーバー起動中：http://localhost:${PORT}`);
});

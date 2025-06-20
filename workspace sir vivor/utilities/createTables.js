const sqlite3 = require("sqlite3");
const { execute } = require("./sql.js");
const path = require("path");
const THEMES_DB_FILE = path.resolve(__dirname, "../data/themesDB.sqlite3");

const main = async () => {
  const db = new sqlite3.Database(THEMES_DB_FILE);
  try {
    await execute(
      db,
      `CREATE TABLE IF NOT EXISTS theme (
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        desc TEXT NOT NULL
        );`
    );

    await execute(
      db,
      `CREATE TABLE IF NOT EXISTS theme_alias (
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
        name TEXT NOT NULL,
        theme_id INTEGER NOT NULL, 
        FOREIGN KEY (theme_id) REFERENCES theme(id)
        );`
    );
  } catch (error) {
    console.log(error);
  } finally {
    db.close();
  }
};

main();
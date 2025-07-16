const sqlite3 = require("sqlite3").verbose();

const path = require("path");
const THEMES_DB_FILE = path.resolve(__dirname, "../data/themesDB.sqlite3");

const JOKE_TABLE_NAME = "joke";
const JOKE_ID = "id";
const JOKE_TEXT = "text";
const JOKE_ADDED_BY = "added_by";
const JOKE_DATE_ADDED = "date_added";

const ROAST_TABLE_NAME = "roast";
const ROAST_ID = "id";
const ROAST_TEXT = "text";
const ROAST_ADDED_BY = "added_by";
const ROAST_DATE_ADDED = "date_added";

const GIFT_TABLE_NAME = "gift";
const GIFT_ID = "id";
const GIFT_TEXT = "text";
const GIFT_ADDED_BY = "added_by";
const GIFT_DATE_ADDED = "date_added";

class jokesRepository {
    constructor() {
        this.db_file = THEMES_DB_FILE;
        this.db = new sqlite3.Database(this.db_file, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`Connected to database via ${this.db_file}`);
            }
        });
    }

    add(product) {
        const sql = `INSERT INTO ${JOKE_TABLE_NAME} (${JOKE_TEXT}, ${JOKE_ADDED_BY}, ${JOKE_DATE_ADDED}) VALUES (?, ?, ?)`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [product.text, product.added_by, product.date_added], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    getById(id) {
        const sql = `SELECT * FROM ${JOKE_TABLE_NAME} WHERE ${JOKE_ID} = ?`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    getAll(diff){
        const sql = `SELECT * FROM ${JOKE_TABLE_NAME}`;

        return new Promise((resolve, reject) => {
            this.db.all(sql, [diff], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }


    themeIdExists(id) {
        const sql = `SELECT 1 FROM ${JOKE_TABLE_NAME} WHERE ${JOKE_ID} = ? LIMIT 1`;

        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(!!row);
            });
        });
    }

    update(product) {
        const sql = `UPDATE ${THEME_TABLE_NAME} SET ${THEME_NAME} = ?, ${THEME_URL} = ?, ${THEME_DESCRIPTION} = ?, ${THEME_DIFFICULTY} = ? WHERE ${THEME_ID} = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [product.name, product.url, product.desc, product.difficulty, product.id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    delete(id) {
        const sql = `DELETE FROM ${THEME_TABLE_NAME} WHERE ${THEME_ID} = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}

class giftsRepository {
    constructor() {
        this.db_file = THEMES_DB_FILE;
        this.db = new sqlite3.Database(this.db_file, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`Connected to database via ${this.db_file}`);
            }
        });
    }

    add(product) {
        const sql = `INSERT INTO ${THEME_TABLE_NAME} (${THEME_NAME}, ${THEME_URL}, ${THEME_DESCRIPTION}, ${THEME_DIFFICULTY}) VALUES (?, ?, ?, ?)`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [product.name, product.url, product.desc, product.difficulty], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    getById(id) {
        const sql = `SELECT * FROM ${THEME_TABLE_NAME} WHERE ${THEME_ID} = ?`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    getAll(diff){
        const sql = `SELECT * FROM ${THEME_TABLE_NAME} WHERE ${THEME_DIFFICULTY} = ? COLLATE NOCASE`;

        return new Promise((resolve, reject) => {
            this.db.all(sql, [diff], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }


    themeIdExists(id) {
        const sql = `SELECT 1 FROM ${THEME_TABLE_NAME} WHERE ${THEME_ID} = ? LIMIT 1`;

        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(!!row);
            });
        });
    }

    update(product) {
        const sql = `UPDATE ${THEME_TABLE_NAME} SET ${THEME_NAME} = ?, ${THEME_URL} = ?, ${THEME_DESCRIPTION} = ?, ${THEME_DIFFICULTY} = ? WHERE ${THEME_ID} = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [product.name, product.url, product.desc, product.difficulty, product.id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    delete(id) {
        const sql = `DELETE FROM ${THEME_TABLE_NAME} WHERE ${THEME_ID} = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}

class roastsRepository {
    constructor() {
        this.db_file = THEMES_DB_FILE;
        this.db = new sqlite3.Database(this.db_file, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`Connected to database via ${this.db_file}`);
            }
        });
    }

    add(product) {
        const sql = `INSERT INTO ${THEME_TABLE_NAME} (${THEME_NAME}, ${THEME_URL}, ${THEME_DESCRIPTION}, ${THEME_DIFFICULTY}) VALUES (?, ?, ?, ?)`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [product.name, product.url, product.desc, product.difficulty], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    getById(id) {
        const sql = `SELECT * FROM ${THEME_TABLE_NAME} WHERE ${THEME_ID} = ?`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    getAll(diff){
        const sql = `SELECT * FROM ${THEME_TABLE_NAME} WHERE ${THEME_DIFFICULTY} = ? COLLATE NOCASE`;

        return new Promise((resolve, reject) => {
            this.db.all(sql, [diff], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }


    themeIdExists(id) {
        const sql = `SELECT 1 FROM ${THEME_TABLE_NAME} WHERE ${THEME_ID} = ? LIMIT 1`;

        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(!!row);
            });
        });
    }

    update(product) {
        const sql = `UPDATE ${THEME_TABLE_NAME} SET ${THEME_NAME} = ?, ${THEME_URL} = ?, ${THEME_DESCRIPTION} = ?, ${THEME_DIFFICULTY} = ? WHERE ${THEME_ID} = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [product.name, product.url, product.desc, product.difficulty, product.id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    delete(id) {
        const sql = `DELETE FROM ${THEME_TABLE_NAME} WHERE ${THEME_ID} = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}
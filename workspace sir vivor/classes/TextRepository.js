const sqlite3 = require("sqlite3").verbose();

const path = require("path");
const TEXT_DB_FILE = path.resolve(__dirname, "../data/textDB.sqlite3");

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
        this.db_file = TEXT_DB_FILE;
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
        const now = new Date();
        const formatted_now = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString('en-US', { hour12: true })}`;


        //console.log(now.getDate());

        return new Promise((resolve, reject) => {
            this.db.run(sql, [product.text, product.added_by, formatted_now], function (err) {
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

    getAll(){
        const sql = `SELECT * FROM ${JOKE_TABLE_NAME}`;

        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    delete(id) {
        const sql = `DELETE FROM ${JOKE_TABLE_NAME} WHERE ${JOKE_ID} = ?`;
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
        this.db_file = TEXT_DB_FILE;
        this.db = new sqlite3.Database(this.db_file, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`Connected to database via ${this.db_file}`);
            }
        });
    }

    add(product) {
        const sql = `INSERT INTO ${GIFT_TABLE_NAME} (${GIFT_TEXT}, ${GIFT_ADDED_BY}, ${GIFT_DATE_ADDED}) VALUES (?, ?, ?)`;
        const now = new Date();
        const formatted_now = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString('en-US', { hour12: true })}`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [product.text, product.added_by, formatted_now], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    getById(id) {
        const sql = `SELECT * FROM ${GIFT_TABLE_NAME} WHERE ${GIFT_ID} = ?`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    getAll(){
        const sql = `SELECT * FROM ${GIFT_TABLE_NAME}`;

        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    delete(id) {
        const sql = `DELETE FROM ${GIFT_TABLE_NAME} WHERE ${GIFT_ID} = ?`;
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
        this.db_file = TEXT_DB_FILE;
        this.db = new sqlite3.Database(this.db_file, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`Connected to database via ${this.db_file}`);
            }
        });
    }

    add(product) {
        const sql = `INSERT INTO ${ROAST_TABLE_NAME} (${ROAST_TEXT}, ${ROAST_ADDED_BY}, ${ROAST_DATE_ADDED}) VALUES (?, ?, ?)`;
        const now = new Date();
        const formatted_now = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString('en-US', { hour12: true })}`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [product.text, product.added_by, formatted_now], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    getById(id) {
        const sql = `SELECT * FROM ${ROAST_TABLE_NAME} WHERE ${ROAST_ID} = ?`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    getAll(){
        const sql = `SELECT * FROM ${ROAST_TABLE_NAME}`;

        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    delete(id) {
        const sql = `DELETE FROM ${ROAST_TABLE_NAME} WHERE ${ROAST_ID} = ?`;
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
module.exports = { jokesRepository, giftsRepository, roastsRepository };
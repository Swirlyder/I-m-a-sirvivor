const sqlite3 = require("sqlite3").verbose();

const path = require("path");
const THEMES_DB_FILE = path.resolve(__dirname, "../data/themesDB.sqlite3");
const THEME_TABLE_NAME = "theme";
const THEME_ID = "id";
const THEME_NAME = "name";
const THEME_URL = "url";
const THEME_DESCRIPTION = "desc";

class themesRepository {
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
        const sql = `INSERT INTO ${THEME_TABLE_NAME} (${THEME_NAME}, ${THEME_URL}, ${THEME_DESCRIPTION}) VALUES (?, ?, ?)`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [product.name, product.url, product.desc], function (err) {
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

    update(product) {
        const sql = `UPDATE ${THEME_TABLE_NAME} SET ${THEME_NAME} = ?, ${THEME_URL} = ?, ${THEME_DESCRIPTION} = ? WHERE ${THEME_ID} = ?`;
        return new Promise((resolve, reject) => { this.db.run(sql, [product.name, product.url, product.desc, product.id], function (err) {
            if (err) {
                return reject(err);
            }
            resolve();
        }); });
    }

    delete(id) {
        const sql = `DELETE FROM ${USER_TABLE} WHERE ${THEME_ID} = ?`;
        return this.db.run(sql, [id]);
    }
}
module.exports = themesRepository;
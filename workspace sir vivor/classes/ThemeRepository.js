const sqlite3 = require("sqlite3").verbose();

const path = require("path");
const THEMES_DB_FILE = path.resolve(__dirname, "../data/themesDB.sqlite3");
const THEME_TABLE_NAME = "theme";
const THEME_ALIAS_TABLE_NAME = "theme_alias";
const THEME_ID = "id";
const THEME_ALIAS_ID = "id";
const THEME_NAME = "name";
const THEME_ALIAS_NAME = "name";
const THEME_URL = "url";
const THEME_DESCRIPTION = "desc";
const THEME_ALIAS_THEME_ID = "theme_id";

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

    getByAlias(alias) {
        const sql = `SELECT theme.id, theme.name, theme.url, theme.desc FROM theme INNER JOIN theme_alias ON theme_alias.theme_id = theme.id WHERE theme_alias.name = ?;`
        return new Promise((resolve, reject) => {
            this.db.get(sql, [alias], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    getByName(name) {
        const sql = `SELECT id, name, url, desc FROM ${THEME_TABLE_NAME} WHERE ${THEME_NAME} = ? COLLATE NOCASE;`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [name], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    themeNameExists(name) {
    const sql = `SELECT 1 FROM ${THEME_TABLE_NAME} WHERE ${THEME_NAME} = ? COLLATE NOCASE LIMIT 1`;
    return new Promise((resolve, reject) => {
        this.db.get(sql, [name], (err, row) => {
            if (err) return reject(err);
            resolve(!!row);
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
        const sql = `UPDATE ${THEME_TABLE_NAME} SET ${THEME_NAME} = ?, ${THEME_URL} = ?, ${THEME_DESCRIPTION} = ? WHERE ${THEME_ID} = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [product.name, product.url, product.desc, product.id], function (err) {
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
class themeAliasRepository {
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
        const sql = `INSERT INTO ${THEME_ALIAS_TABLE_NAME} (${THEME_ALIAS_NAME}, ${THEME_ALIAS_THEME_ID}) VALUES (?, ?)`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [product.name, product.theme_id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    getById(id) {
        const sql = `SELECT * FROM ${THEME_ALIAS_TABLE_NAME} WHERE ${THEME_ALIAS_ID} = ?`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    getByAlias(name) {
        const sql = `SELECT * FROM theme_alias WHERE theme_alias.name = ?;`
        return new Promise((resolve, reject) => {
            this.db.get(sql, [name], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    update(product) {
        const sql = `UPDATE ${THEME_ALIAS_TABLE_NAME} SET ${THEME_ALIAS_NAME} = ?, ${THEME_ID} = ? WHERE ${THEME_ALIAS_ID} = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [product.name, product.theme_id, product.id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    delete(id) {
        const sql = `DELETE FROM ${THEME_ALIAS_TABLE_NAME} WHERE ${THEME_ALIAS_ID} = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    themeAliasExists(alias) {
        const sql = `SELECT 1 FROM ${THEME_ALIAS_TABLE_NAME} WHERE ${THEME_ALIAS_NAME} = ? LIMIT 1`;

        return new Promise((resolve, reject) => {
            this.db.get(sql, [alias], (err, row) => {
                if (err) return reject(err);
                resolve(!!row);
            });
        });
    }

    themeAliasIdExists(id) {
        const sql = `SELECT 1 FROM ${THEME_ALIAS_TABLE_NAME} WHERE ${THEME_ALIAS_THEME_ID} = ? LIMIT 1`;

        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(!!row);
            });
        });
    }
}

module.exports = { themesRepository, themeAliasRepository };
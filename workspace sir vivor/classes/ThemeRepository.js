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
const THEME_DIFFICULTY = "difficulty";
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

    getByAlias(alias) {
        const sql = `
        SELECT 
            t.${THEME_ID}, 
            t.${THEME_NAME}, 
            t.${THEME_URL}, 
            t.${THEME_DESCRIPTION}, 
            t.${THEME_DIFFICULTY} 
        FROM 
            ${THEME_TABLE_NAME} t 
        INNER JOIN 
            ${THEME_ALIAS_TABLE_NAME} a 
            ON a.${THEME_ALIAS_THEME_ID} = t.${THEME_ID} 
        WHERE 
            a.${THEME_ALIAS_NAME} = ?;`

        return new Promise((resolve, reject) => {
            this.db.get(sql, [alias], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    getByName(name) {
        const sql = `SELECT * FROM ${THEME_TABLE_NAME} WHERE ${THEME_NAME} = ? COLLATE NOCASE;`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [name], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    getAllWithAliases() {
        const sql = `
        SELECT 
            t.${THEME_ID} AS id,
            t.${THEME_NAME} AS name,
            t.${THEME_URL} AS url,
            t.${THEME_DESCRIPTION} AS desc,
            t.${THEME_DIFFICULTY} AS difficulty,
            a.${THEME_ALIAS_NAME} AS alias_name
        FROM 
            ${THEME_TABLE_NAME} t
        LEFT JOIN 
            ${THEME_ALIAS_TABLE_NAME} a 
            ON t.${THEME_ID}  = a.${THEME_ALIAS_THEME_ID};`;

        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) return reject(err);

                const themesMap = new Map();

                for (const row of rows) {
                    const id = row.id;

                    if (!themesMap.has(id)) {
                        themesMap.set(id, {
                            id: row.id,
                            name: row.name,
                            url: row.url,
                            desc: row.desc,
                            difficulty: row.difficulty,
                            aliases: []
                        });
                    }

                    if (row.alias_name) {
                        themesMap.get(id).aliases.push(row.alias_name);
                    }
                }
                resolve(Array.from(themesMap.values()));
            });
        });
    }

    getAllByDifficulty(diff){
        const sql = `SELECT * FROM ${THEME_TABLE_NAME} WHERE ${THEME_DIFFICULTY} = ? COLLATE NOCASE`;

        return new Promise((resolve, reject) => {
            this.db.all(sql, [diff], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
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
        const sql = `SELECT * FROM ${THEME_ALIAS_TABLE_NAME} WHERE ${THEME_ALIAS_NAME} = ?;`
        return new Promise((resolve, reject) => {
            this.db.get(sql, [name], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    update(product) {
        const sql = `UPDATE ${THEME_ALIAS_TABLE_NAME} SET ${THEME_ALIAS_NAME} = ?, ${THEME_ALIAS_THEME_ID} = ? WHERE ${THEME_ALIAS_ID} = ?`;
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

    deleteByThemeId(themeId) {
        const sql = `DELETE FROM ${THEME_ALIAS_TABLE_NAME} WHERE ${THEME_ALIAS_THEME_ID} = ?`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [themeId], function (err) {
                if (err) return reject(err);
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
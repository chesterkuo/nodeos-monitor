const mysql = require('mysql');
const request = require('request');

const HOSTNAME = process.env.HOSTNAME;
const INTERNAL = process.env.INTERNAL;
const HOST = process.env.HOST;
const INTERVAL_SECONDS = process.env.INTERVAL_SECONDS;

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_TABLE = process.env.DB_TABLE;

//process.env.ENV_VARIABLE


function get_block_num() {
    // Setting URL and headers for request
    var options = {
        url: 'http://' + HOST + '/v1/chain/get_info',
        headers: {
            'User-Agent': 'request'
        }
    };
    // Return new promise
    return new Promise(function (resolve, reject) {
        // Do async job
        request.get(options, function (err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })

}


var pool = mysql.createPool({
    connectionLimit: 1,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
});

function disconnect() {
    pool.end(function (err) {
        if (err) {
            throw err;
        } else {
            console.log("pool disconnected");
        }
    });
}

var info = {};

info.updated_at = new Date();
info.head_block_num = 0;
info.internal = INTERNAL;

function update_info(info_str) {
    return new Promise(function (resolve, reject) {
        pool.query('insert into ' + DB_TABLE + ' (hostname, info) values (? , ?) ON DUPLICATE KEY UPDATE info = ?;', [HOSTNAME, info_str, info_str], function (err, rows, fields) {
            // Call reject on error states,
            // call resolve with results
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

const seconds = INTERVAL_SECONDS, the_interval = seconds * 1000;
setInterval(function () {
    try {
        get_block_num().then((result) => {
            info.head_block_num = result.head_block_num;
            info.updated_at = new Date();
        }).then(() => {
            update_info(JSON.stringify(info));
        });
    } catch (e) {
        console.log(e);
    }
}, the_interval);




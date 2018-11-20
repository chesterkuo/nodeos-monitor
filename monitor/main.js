const mysql = require('mysql');
const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')


const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_TABLE = process.env.DB_TABLE;
const BOT_TOKEN = process.env.BOT_TOKEN;
const INTERVAL_SECONDS = process.env.INTERVAL_SECONDS;
const CHANNEL = process.env.CHANNEL;
const NUM_DELTA = process.env.NUM_DELTA;


//process.env.ENV_VARIABLE
const telegram = new Telegram(BOT_TOKEN)


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


function get_all_info() {
    return new Promise(function (resolve, reject) {
        pool.query('select * from ' + DB_TABLE , function (err, rows, fields) {
            // Call reject on error states,
            // call resolve with results
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function health_check(host_infos){
  let nums = host_infos.map(i => i.info.head_block_num);
  let max_num = Math.max(...nums);
  let threshold = max_num - NUM_DELTA;
  let unhealthy_infos = host_infos.filter(hi=>{return hi.info.internal && hi.info.head_block_num < threshold });

  if(unhealthy_infos.length>0){
    var warning = "[Warning]\n";
    warning += 'max_num: '+max_num + '\n';
    for(var i=0; i < unhealthy_infos.length ; i++){
      warning += unhealthy_infos[i].hostname + '\n';
      warning += JSON.stringify(unhealthy_infos[i].info, undefined, 2) + '\n';
    }
    telegram.sendMessage(CHANNEL,warning);
  }
}

const seconds = INTERVAL_SECONDS, the_interval = seconds * 1000;
setInterval(function () {
    try {
        get_all_info().then((results)=>{
          let host_infos = results.forEach(r=>r.info = JSON.parse(r.info));
          health_check(results);
        })

    } catch (e) {
        console.log(e);
    }
}, the_interval);

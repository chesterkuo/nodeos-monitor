const request = require('request');
const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')

const CHANNEL = process.env.CHANNEL;
const BOT_TOKEN= process.env.BOT_TOKEN;
const INTERVAL_SECONDS = process.env.INTERVAL_SECONDS;

//process.env.ENV_VARIABLE
const telegram = new Telegram(BOT_TOKEN)

function get_status() {
    // Setting URL and headers for request
    var options = {
        url: 'http://localhost:26657/status',
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


const seconds = INTERVAL_SECONDS, the_interval = seconds * 1000;
setInterval(function () {
    try {
      var my_status = get_status();

      my_status.then((body)=>{
        if(body.result.sync_info.catching_up){
          telegram.sendMessage(CHANNEL,"irisnet alert catching up is true");
        }else if(!body.result.sync_info.catching_up){
          //telegram.sendMessage(CHANNEL,"irisnet alert catching up is false");
        }else{
          telegram.sendMessage(CHANNEL,"irisnet alert catching up is neither true nor false, logic error in code");
        }
      });

      my_status.catch(function(e){
        console.log(e);
        telegram.sendMessage(CHANNEL,"irisnet get status error occurs");
      })

    } catch (e) {
        console.log(e);
        telegram.sendMessage(CHANNEL,"irisnet get status unexpected error occurs");
    }
}, the_interval);


/* status sample output
curl http://localhost:26657/status

{
  "jsonrpc": "2.0",
  "id": "",
  "result": {
    "node_info": {
      "protocol_version": {
        "p2p": "5",
        "block": "9",
        "app": "0"
      },
      "id": "d1efbae2a0e788f1aed08b0cc3abe1994eee06eb",
      "listen_addr": "54.169.166.26:26656",
      "network": "irishub",
      "version": "0.28.0",
      "channels": "4020212223303800",
      "moniker": "irisnetsg",
      "other": {
        "tx_index": "on",
        "rpc_address": "tcp://0.0.0.0:26657"
      }
    },
    "sync_info": {
      "latest_block_hash": "9BA3F1F6C2C73123A06579B8C369EE060741FF344425D18F16243F269F297CC6",
      "latest_app_hash": "FCD223E593399A2749BFF9C474D26269D997EA693A7834B5185978734671E72D",
      "latest_block_height": "1208721",
      "latest_block_time": "2019-06-04T04:39:56.467179304Z",
      "catching_up": false
    },
    "validator_info": {
      "address": "A7D608294899506685DD9A296163B9667893645A",
      "pub_key": {
        "type": "tendermint/PubKeyEd25519",
        "value": "NfJnIzoPZnvJSZDBsU9/8PO3oWQmB/C4lYaFX3ChSMA="
      },
      "voting_power": "10000994"
    }
  }
}

*/

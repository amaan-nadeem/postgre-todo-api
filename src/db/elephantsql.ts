import * as dotenv from 'dotenv';
dotenv.config();
var pg = require('pg');
var conString = process.env.POSTGRES_URI //Can be found in the Details page
var client = new pg.Client(conString);
client.connect(function(err: any, res: any) {
  if(res){
    console.log("database connected");
  }
  if(err) {
    return console.error('could not connect to postgres', err);
  }
});

export default client;
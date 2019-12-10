// import * as dotenv from 'dotenv';
// dotenv.config();
// const Pool = require("pg").Pool;
// const isProduction = process.env.NODE_ENV === 'production'
// const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
// const pool = new Pool({
//   connectionString: isProduction ? process.env.DATABASE_URL: connectionString,
//   ssl: isProduction
// });
// pool.connect().then(() => {console.log("Database Connected")});
// export default pool;

var pg = require('pg');
//or native libpq bindings
//var pg = require('pg').native

var conString = "postgresql://bbekcgdb:Fn9ee1_D3H6eF2GNDZXhb1Jop8_jpD66@rajje.db.elephantsql.com:5432/bbekcgdb" //Can be found in the Details page
var client = new pg.Client(conString);
client.connect(function(err: any, res: any) {
  if(res){
    console.log("database connected");
  }
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err: any, result: any) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
    // >> output: 2018-08-23T14:02:57.117Z
    client.end();
  });
});

export default client;
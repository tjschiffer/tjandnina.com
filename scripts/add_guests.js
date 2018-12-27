const mysql = require('mysql2');
const dbconfig = require('../config/database');
const fs = require('fs');
const argon2 = require('argon2');

const createDatabase = async() => {
  const connectionConfig = Object.assign({}, dbconfig.connection);
  // The database cannot be defined, since this script creates that database
  delete connectionConfig['database'];
  const connection = mysql.createConnection(connectionConfig);

  const queries = [];

  const inviteData = await new Promise(resolve => {
    fs.readFile('./config/invites_add.csv', 'utf-8', async (err, data) => {
      const pInsertValuesRows = data
        .split('\r\n') // Split the rows
        .slice(1, data.length - 1) // Remove the header row
        .map(async row => { // Create the secure hash for the row
          const hash = await argon2.hash(row);
          return row + ',\'' + hash.substr(hash.length - 32) + '\''; // only use the last 32 chars of the hash
        });
      const insertValuesRows = await Promise.all(pInsertValuesRows);
      const insertValues = insertValuesRows.join('),\r\n(') // Rejoin the array with '(,('
        .replace(new RegExp(',,', 'g'), ',NULL,'); // Replace any empty values with null;
      resolve('(' + insertValues + ')');
    });
  });

  queries.push('INSERT INTO `' + dbconfig.connection.database + '`.`' + dbconfig.invites_table + '` \
    (`invite_id`, `zip_code`, `invite_welcome_event`, `invite_after_party`, `hash`) \
    VALUES \
    ' + inviteData);

  const guestData = await new Promise(resolve => {
    fs.readFile('./config/guests_add.csv', 'utf-8', async (err, data) => {
      const insertValues = data
        .split('\r\n') // Split the rows
        .slice(1, data.length - 1) // Remove the header row
        .join('),\n(') // Rejoin the array with '(,('
        .replace(new RegExp(',,', 'g'), ',NULL,'); // Replace any empty values with null;
      resolve('(' + insertValues + ')');
    });
  });

  queries.push('INSERT INTO `' + dbconfig.connection.database + '`.`' + dbconfig.guests_table + '` \
    (`invite_id`, `first_name`, `last_name`) \
    VALUES \
    ' + guestData);


  for (const query of queries) {
    if (process.argv.slice(2).indexOf('--dry-run=false') > -1) {
      console.log('Executing statement: ' + query);
      const executedQuery = await new Promise(resolve => {
        connection.query(query, err => {
          if (err) {
            resolve(err);
          } else {
            resolve('Success!');
          }
        });
      });
      console.log('Result: ' + executedQuery + '\n');
    } else {
      console.log('Dry run statement: ' + query + '\n');
    }
  }

  connection.end();
  return 'Complete.';
};

createDatabase().then((result) => {
  console.log(result);
});

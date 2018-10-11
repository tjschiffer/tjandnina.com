const mysql = require('mysql2');
const dbconfig = require('../config/database');
const fs = require('fs');
const argon2 = require('argon2');

const createDatabase = async() => {
  const connectionConfig = Object.assign({}, dbconfig.connection);
  // The database cannot be defined, since this script creates that database
  delete connectionConfig['database'];
  const connection = mysql.createConnection(connectionConfig);

  const queries = [
    'CREATE DATABASE IF NOT EXISTS `' + dbconfig.connection.database + '`',

    'CREATE TABLE `' + dbconfig.connection.database + '`.`' + dbconfig.users_table + '` ( \
    `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `password_hash` CHAR(95) NOT NULL, \
        PRIMARY KEY (`user_id`), \
    UNIQUE INDEX `id_UNIQUE` (`user_id` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC))',

    'INSERT INTO `' + dbconfig.connection.database + '`.`' + dbconfig.users_table + '` \
    (`user_id`, `username`, `password_hash`) \
    VALUES \
    (1, \'' + dbconfig.app.user + '\', \'' + dbconfig.app.password_hash + '\')',

    'CREATE TABLE `' + dbconfig.connection.database + '`.`' + dbconfig.invites_table + '` ( \
    `invite_id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `hash` CHAR(32) NOT NULL, \
    `zip_code` VARCHAR(20) NOT NULL, \
    `invite_welcome_event` BOOLEAN NOT NULL, \
    `invite_after_party` BOOLEAN NOT NULL, \
    `note` TEXT, \
        PRIMARY KEY (`invite_id`), \
    UNIQUE INDEX `id_UNIQUE` (`invite_id` ASC))',

    'CREATE TABLE `' + dbconfig.connection.database + '`.`' + dbconfig.guests_table + '` ( \
    `guest_id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `invite_id` INT UNSIGNED NOT NULL, \
    `first_name` VARCHAR(30) NOT NULL, \
    `last_name` VARCHAR(30) NOT NULL, \
    `attending` BOOLEAN, \
    `attending_welcome_event` BOOLEAN, \
    `attending_after_party` BOOLEAN, \
    `timestamp` TIMESTAMP NULL, \
        PRIMARY KEY (`guest_id`), \
    UNIQUE INDEX `id_UNIQUE` (`guest_id` ASC), \
    FOREIGN KEY (`invite_id`) \
    REFERENCES `' + dbconfig.connection.database + '`.' + dbconfig.invites_table + '(invite_id) \
    ON UPDATE CASCADE ON DELETE RESTRICT)',

    'CREATE TABLE `' + dbconfig.connection.database + '`.`' + dbconfig.guests_history_table + '` ( \
    `guest_history_id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `guest_id` INT UNSIGNED NOT NULL, \
    `invite_id` INT UNSIGNED NOT NULL, \
    `first_name` VARCHAR(30) NOT NULL, \
    `last_name` VARCHAR(30) NOT NULL, \
    `attending` BOOLEAN, \
    `attending_welcome_event` BOOLEAN, \
    `attending_after_party` BOOLEAN, \
    `timestamp` TIMESTAMP NULL, \
        PRIMARY KEY (`guest_history_id`), \
    UNIQUE INDEX `id_UNIQUE` (`guest_history_id` ASC))'
  ];

  // Drop the database if the argument "--drop" is present
  if (process.argv.slice(2).indexOf('--drop') > -1) {
    queries.unshift('DROP DATABASE IF EXISTS `' + dbconfig.connection.database + '`');
  }

  const inviteData = await new Promise(resolve => {
    fs.readFile('./config/invites.csv', 'utf-8', async (err, data) => {
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
    fs.readFile('./config/guests.csv', 'utf-8', async (err, data) => {
      const insertValues = data
        .split('\r\n') // Split the rows
        .slice(1, data.length - 1) // Remove the header row
        .join('),\r\n(') // Rejoin the array with '(,('
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

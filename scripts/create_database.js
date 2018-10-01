const mysql = require('mysql');
const dbconfig = require('../config/database');

const createDatabase = async() => {
  const connectionConfig = Object.assign({}, dbconfig.connection);
  // The database cannot be defined, since this script creates that database
  delete connectionConfig['database'];
  const connection = mysql.createConnection(connectionConfig);

  const queries = [
    'CREATE DATABASE IF NOT EXISTS `' + dbconfig.connection.database + '`',

    'CREATE TABLE `' + dbconfig.connection.database + '`.`' + dbconfig.users_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `password_hash` CHAR(95) NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC))',

    'INSERT INTO `' + dbconfig.connection.database + '`.`' + dbconfig.users_table + '` \
    (`id`, `username`, `password_hash`) \
    VALUES \
    (1, \'' + dbconfig.app.user + '\', \'' + dbconfig.app.password_hash + '\')',

    'CREATE TABLE `' + dbconfig.connection.database + '`.`' + dbconfig.rsvp_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `zip_code` VARCHAR(20) NOT NULL, \
    `note` TEXT, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC))',

    'CREATE TABLE `' + dbconfig.connection.database + '`.`' + dbconfig.guests_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `rsvp_id` INT UNSIGNED NOT NULL, \
    `first_name` VARCHAR(30) NOT NULL, \
    `last_name` VARCHAR(30) NOT NULL, \
    `attending` BOOLEAN, \
    `attending_welcome_event` BOOLEAN, \
    `attending_after_party` BOOLEAN, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    FOREIGN KEY (rsvp_id) \
    REFERENCES `tjandnina`.rsvp(id) \
    ON UPDATE CASCADE ON DELETE RESTRICT)',

    'CREATE TABLE `' + dbconfig.connection.database + '`.`' + dbconfig.guests_history_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `guests_id` INT UNSIGNED NOT NULL, \
    `rsvp_id` INT UNSIGNED NOT NULL, \
    `first_name` VARCHAR(30) NOT NULL, \
    `last_name` VARCHAR(30) NOT NULL, \
    `attending` BOOLEAN, \
    `attending_welcome_event` BOOLEAN, \
    `attending_after_party` BOOLEAN, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC))'
  ];

  // Drop the database if the argument "--drop" is present
  if (process.argv.slice(2).indexOf('--drop') > -1) {
    queries.unshift('DROP DATABASE IF EXISTS `' + dbconfig.connection.database + '`' + '\n');
  }

  for (const query of queries) {
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
    console.log('Result: ' + executedQuery+ '\n');
  }

  connection.end();
  return 'Complete.';
};

createDatabase().then((result) => {
  console.log(result);
});

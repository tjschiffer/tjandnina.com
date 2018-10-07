const mysql = require('mysql2');
const named = require('yesql').mysql;
const dbconfig = require('../config/database');

const pool = mysql.createPool(dbconfig.connection);

module.exports = {
  /**
   * Find an invite and list of guests using the supplied inviteFormData
   *
   * @param inviteFormData
   */
  findInvite: async (inviteFormData) => {
    try {
      const promisePool = pool.promise();
      const [invite_id,] = await promisePool.query(named(`
        SELECT invite_id FROM guests g
        JOIN invites i
        WHERE g.first_name = :firstName AND g.last_name = :lastName
      `)(
        {
          firstName: inviteFormData.firstName,
          lastName: inviteFormData.lastName
        }
      ));
      if (invite_id.length === 0) {
        return {};
      }
      const [invite,] = await promisePool.query(named(`
        SELECT hash FROM guests g 
        WHERE g.first_name = :firstName AND g.last_name = :lastName
      `)(
        {
          firstName: inviteFormData.firstName,
          lastName: inviteFormData.lastName
        }
      ));
    } catch(e) {
      return false;
    }
  }
};

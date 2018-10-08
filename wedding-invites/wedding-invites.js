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
      const [invites,] = await promisePool.query(named(`
        SELECT i.* FROM ${dbconfig.guests_table} g
        JOIN ${dbconfig.invites_table} i ON g.invite_id = i.id AND i.zip_code = :zipCode
        WHERE g.first_name = :firstName AND g.last_name = :lastName
        LIMIT 1
      `)(
        {
          firstName: inviteFormData.firstName,
          lastName: inviteFormData.lastName,
          zipCode: inviteFormData.zipCode
        }
      ));
      if (invites.length === 0) {
        return {};
      }
      const invite = invites[0];
      const [guests,] = await promisePool.query(named(`
        SELECT id, first_name, last_name, attending, attending_welcome_event, attending_after_party FROM guests g 
        WHERE invite_id = :inviteId
      `)(
        {
          inviteId: invite.id
        }
      ));
      return {
        invite: invite,
        guests: guests
      }
    } catch(e) {
      return false;
    }
  }
};

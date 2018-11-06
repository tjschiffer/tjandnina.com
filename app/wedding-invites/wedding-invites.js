const mysql = require('mysql2');
const named = require('yesql').mysql;
const dbconfig = require('../../config/database');
const config = require('../../config/config');
// const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const mustache = require('mustache');
const fs = require('fs');
const path = require('path');
const util = require('util');

const pool = mysql.createPool(dbconfig.connection);

/**
 * Send an email with the RSVP information
 *
 * @param guests
 * @param invite
 */
const sendRsvpEmail = async (guests, invite) => {
  if (!config.sendEmails) {
    return;
  }
  try {
    const guestData = guests.map(guest => {
      const rsvpData = {
        attending: guest.attending === 1 ? 'Yes' : 'No'
      };
      if (invite.invite_welcome_event) {
        rsvpData.attending_welcome_event = guest.attending_welcome_event === 1 ? 'Yes' : 'No';
      }
      if (invite.invite_after_party) {
        rsvpData.attending_after_party = guest.attending_after_party === 1 ? 'Yes' : 'No';
      }
      return Object.assign({}, guest, rsvpData);
    });

    const readFile = util.promisify(fs.readFile);
    const emailTemplate = await readFile(path.join(__dirname, './rsvp-email-template.mustache'), 'utf8');
    const emailContent = mustache.render(emailTemplate, {guests: guestData});

    // const transporter = nodemailer.createTransport({
    //   sendmail: true
    // });
    // transporter.sendMail({
    //   to: 'tjandnina2019@gmail.com',
    //   subject: 'RSVP',
    //   text: emailContent
    // }).then().catch(err => {
    //   console.log(err);
    // });


  } catch(e) {
    console.log(e);
  }
};

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
        JOIN ${dbconfig.invites_table} i ON g.invite_id = i.invite_id 
          AND IF(:zipCode is NULL,  i.zip_code IS NULL, i.zip_code = :zipCode)
        WHERE g.first_name = :firstName AND g.last_name = :lastName
        LIMIT 1
      `)(
        {
          firstName: inviteFormData.firstName,
          lastName: inviteFormData.lastName,
          zipCode: inviteFormData.zipCode || null
        }
      ));
      if (invites.length === 0) {
        return {};
      }
      const invite = invites[0];
      const [guests,] = await promisePool.query(named(`
        SELECT guest_id, invite_id, first_name, last_name, attending, attending_welcome_event, attending_after_party FROM guests g 
        WHERE invite_id = :inviteId
      `)(
        {
          inviteId: invite.invite_id
        }
      ));
      return {
        invite: invite,
        guests: guests
      }
    } catch(e) {
      console.log(e);
      return false;
    }
  },

  /**
   *
   * @param guestData
   *  {
   *    guests: [],
   *    invite: {}
   *  }
   * @returns {Promise<*>}
   */
  submitInvite: async (guestData) => {
    try {
      const promisePool = pool.promise();
      // Confirm with the database that the invite supplied
      // by the request exists (protects against fake requests)
      // and also get if the user is authorized to RSVP to special events
      const [invites,] = await promisePool.query(named(`
        SELECT  i.invite_welcome_event, i.invite_after_party FROM ${dbconfig.invites_table} i
        WHERE i.invite_id = :id AND i.hash = :hash
        LIMIT 1
      `)(
        {
          id: guestData.invite.invite_id,
          hash: guestData.invite.hash,
        }
      ));
      if (invites.length === 0) {
        return false;
      }
      const invite = invites[0];
      // Null out the invite to the welcome event if
      // the user is not invited
      if (!invite.invite_welcome_event) {
        guestData.guests = guestData.guests.map(guest => {
          guest.attending_welcome_event = null;
          return guest;
        });
      }
      // Null out the invite to the after party if
      // the user is not invited
      if (!invite.invite_after_party) {
        guestData.guests = guestData.guests.map(guest => {
          guest.attending_after_party = null;
          return guest;
        });
      }
      sendRsvpEmail(guestData.guests, invite).then();

      const guestIdsToUpdate = guestData.guests.reduce((guestIdsToUpdate, guest) => {
        guestIdsToUpdate.push(guest.guest_id);
        return guestIdsToUpdate;
      }, []);
      // Save the current state to the history table
      await promisePool.query(named(`
        INSERT INTO ${dbconfig.guests_history_table}
        SELECT null, g.* FROM ${dbconfig.guests_table} g
        WHERE invite_id = :inviteId AND guest_id IN (:guestIdsToUpdate)
      `)({
          inviteId: guestData.invite.invite_id,
          guestIdsToUpdate: guestIdsToUpdate
        })
      );

      // Add the note to the invite table if there is one
      if (guestData.invite.note && guestData.invite.note.length > 0) {
        await promisePool.query(named(`
              UPDATE ${dbconfig.invites_table}
              SET note = :note
              WHERE invite_id = :inviteId
              LIMIT 1;
            `)({
            note: guestData.invite.note,
            inviteId: guestData.invite.invite_id
          })
        );
      }

      // Update the guest values
      for (const guest of guestData.guests) {
        const [updateGuest,] = await promisePool.query(named(`
            UPDATE ${dbconfig.guests_table}
            SET attending = :attending, 
                attending_welcome_event = :attendingWelcomeEvent,
                attending_after_party = :attendingAfterParty,
                timestamp = NOW()
            WHERE guest_id = :guestId and invite_id = :inviteId
            LIMIT 1;
          `)({
            attending: guest.attending,
            attendingWelcomeEvent: guest.attending_welcome_event,
            attendingAfterParty: guest.attending_after_party,
            guestId: guest.guest_id,
            inviteId: guestData.invite.invite_id
          })
        );
        if (updateGuest.affectedRows !== 1) {
          return false;
        }
      }

      return true;
    } catch(e) {
      console.log(e);
      return false;
    }
  },

  /**
   * Get invite data for the admin site /invites
   */
  getAllInvitesWithGuests: async () => {
    try {
      const promisePool = pool.promise();
      const [invites,] = await promisePool.query(`
        SELECT invite_id, zip_code, note FROM ${dbconfig.invites_table}
      `);
      const [guests,] = await promisePool.query(`
        SELECT invite_id, first_name, last_name, attending, attending_welcome_event, attending_after_party FROM guests
      `);
      return invites.reduce((invitesWithGuests, invite) => {
        invite.guests = guests.filter(guest => {
          return guest.invite_id === invite.invite_id
        });
        invitesWithGuests.push(invite);
        return invitesWithGuests;
      }, []);
    } catch(e) {
      console.log(e);
      return false;
    }
  },
};

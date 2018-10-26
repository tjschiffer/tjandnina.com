<template>
  <div>
    <div v-if="errorMessage"
         v-text="errorMessage"
         class="tj--width-full
                tj--border-radius-3
                tj--bg-red
                tj--border-dark-gray
                tj--font-dark-gray
                tj--padding-1
                tj--text-align-center
                tj--margin-bottom-2">
    </div>
    <div v-else-if="loading" class="tj--text-align-center tj--margin-top-5">
      <loading-dots></loading-dots>
    </div>
    <table v-else class="tj--width-full">
      <tr>
        <th v-for="headerKey in allHeaderKeys"
            v-text="headerKey.display"
            class="tj--border-dark-gray-1 tj--text-align-center tj--padding-1"></th>
      </tr>
      <template v-for="invite in invites">
        <tr>
          <td v-for="headerKey in headerKeysInvites"
              v-text="invite[headerKey.key]"
              v-bind:rowspan="invite.guests.length"
              class="tj--border-dark-gray-1 tj--text-align-center tj--padding-1"></td>
          <td v-for="headerKey in headerKeysGuests"
              v-text="convertToBool(headerKey.type, invite.guests[0][headerKey.key])"
              class="tj--border-dark-gray-1 tj--text-align-center tj--padding-1"></td>
        </tr>
        <tr v-for="guest in invite.guests.slice(1)">
          <td v-for="headerKey in headerKeysGuests"
              v-text="convertToBool(headerKey.type, guest[headerKey.key])"
              class="tj--border-dark-gray-1 tj--text-align-center tj--padding-1"></td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script>
  import axios from 'axios'
  import loadingDots from '../../vue-components/loading-dots'
  const defaultErrorMessage = 'An unknown error has occurred.';

  const headerKeysInvites = [
    {
      key: 'invite_id',
      display: 'Invite Id'
    },
    {
      key: 'note',
      display: 'Note'
    },
    {
      key: 'zip_code',
      display: 'Zip Code'
    }
  ];

  const headerKeysGuests = [
    {
      key: 'first_name',
      display: 'First Name'
    },
    {
      key: 'last_name',
      display: 'Last Name'
    },
    {
      key: 'attending',
      display: 'Attending',
      type: 'yes|no'
    },
    {
      key: 'attending_after_party',
      display: 'Attending After Party',
      type: 'yes|no'
    },
    {
      key: 'attending_welcome_event',
      display: 'Attending Welcome Event',
      type: 'yes|no'
    },
  ];

  export default {
    name: 'invites',
    data() {
      return {
        invites: [],
        loading: true,
        errorMessage: null,
        headerKeysInvites: headerKeysInvites,
        headerKeysGuests: headerKeysGuests
      }
    },
    components: {
      loadingDots
    },
    computed: {
      allHeaderKeys() {
        return this.headerKeysInvites.concat(this.headerKeysGuests);
      }
    },
    async beforeCreate() {
      try {
        const invitesResponse = await axios.post('/invites');
        this.invites = invitesResponse.data.invitesWithGuests;
      } catch(err) {
        this.errorMessage = defaultErrorMessage;
      }
      this.loading = false;
    },
    methods: {
      convertToBool(type, val) {
        if (type === 'yes|no' && val === 0) {
          return 'No';
        }
        if (type === 'yes|no' && val === 1) {
          return 'Yes';
        }
        return val;
      }
    }
  }
</script>

<style lang="scss" scoped>
  table {
    border-collapse: collapse;
  }
</style>
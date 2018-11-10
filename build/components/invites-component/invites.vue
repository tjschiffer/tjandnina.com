<template>
  <div>
    <div class="tj-grid-flex">
      <div class="tj-grid-flex__cell-1-3
                  tj-grid-flex
                  tj-grid-flex--align-center
                  tj--margin-bottom-2">
        <label for="filters.name" class="tj--white-space-no-wrap tj--margin-right-1">Filter by Name:</label>
        <div class="tj-grid-flex__cell"><input id="filters.name"
                                               type="text"
                                               class="tj-input tj--width-full"
                                               v-model="filters.name"></div>
      </div>
    </div>
    <div class="tj-grid-flex
                tj-grid-flex--align-center
                tj--margin-bottom-2">
      <span class="tj--white-space-no-wrap tj--margin-right-1">Attending:</span>
      <div>
        <label class="tj--padding-hor-1"><input
            type="radio"
            name="attending"
            v-bind:value="1"
            v-model="filters.attending"> Yes</label>
        <label class="tj--padding-hor-1"><input
            type="radio"
            name="attending"
            v-bind:value="0"
            v-model="filters.attending"> No</label>
        <label class="tj--padding-hor-1"><input
            type="radio"
            name="attending"
            v-bind:value="null"
            v-model="filters.attending"> Has Not Responded</label>
      </div>
    </div>
    <div class="tj-grid-flex
                tj-grid-flex--align-center
                tj--margin-bottom-2">
      <span class="tj--white-space-no-wrap tj--margin-right-1">Attending Welcome Event:</span>
      <div>
        <label class="tj--padding-hor-1"><input
            type="radio"
            name="attending_welcome_event"
            v-bind:value="1"
            v-model="filters.attending_welcome_event"> Yes</label>
        <label class="tj--padding-hor-1"><input
            type="radio"
            name="attending_welcome_event"
            v-bind:value="0"
            v-model="filters.attending_welcome_event"> No</label>
        <label class="tj--padding-hor-1"><input
            type="radio"
            name="attending_welcome_event"
            v-bind:value="null"
            v-model="filters.attending_welcome_event"> Has Not Responded</label>
      </div>
    </div>
    <div class="tj-grid-flex
                tj-grid-flex--align-center
                tj--margin-bottom-2">
      <span class="tj--white-space-no-wrap tj--margin-right-1">Attending After Party:</span>
      <div>
        <label class="tj--padding-hor-1"><input
            type="radio"
            name="attending_after_party"
            v-bind:value="1"
            v-model="filters.attending_after_party"> Yes</label>
        <label class="tj--padding-hor-1"><input
            type="radio"
            name="attending_after_party"
            v-bind:value="0"
            v-model="filters.attending_after_party"> No</label>
        <label class="tj--padding-hor-1"><input
            type="radio"
            name="attending_after_party"
            v-bind:value="null"
            v-model="filters.attending_after_party"> Has Not Responded</label>
      </div>
    </div>

    <div class="tj-grid-flex tj-grid-flex--align-center tj--margin-bottom-2">
      <div>
        <button class="tj-button
                       tj-button--parisian-sky
                       tj--border-radius-3
                       tj--padding-hor-2
                       tj--padding-vert-1"
                v-on:click="clearFilters">Clear Filters</button>
      </div>
      <div class="tj--margin-left-auto tj--padding-hor-2">
        Guest Count: {{ guestCount }}
      </div>
    </div>


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
      <template v-for="invite in filteredInvites">
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
      key: 'attending_welcome_event',
      display: 'Attending Welcome Event',
      type: 'yes|no'
    },
    {
      key: 'attending_after_party',
      display: 'Attending After Party',
      type: 'yes|no'
    }
  ];

  const defaultFilters = () => {
    return {
      name: undefined,
        attending: undefined,
      attending_after_party: undefined,
      attending_welcome_event: undefined
    }
  };

  export default {
    name: 'invites',
    data() {
      return {
        invites: [],
        loading: true,
        errorMessage: null,
        headerKeysInvites: headerKeysInvites,
        headerKeysGuests: headerKeysGuests,
        filters: defaultFilters()
      }
    },
    components: {
      loadingDots
    },
    computed: {
      allHeaderKeys() {
        return this.headerKeysInvites.concat(this.headerKeysGuests);
      },
      filteredInvites() {
        const _this = this;
        return this.invites.reduce((filteredInvites, invite) => {
          const filteredGuests = invite.guests.filter(guest => {
            const fullNameLowerCase = (guest.first_name + ' ' + guest.last_name).toLowerCase();
            if (_this.filters.name && fullNameLowerCase.indexOf(_this.filters.name.toLowerCase()) === -1) {
              return false;
            }

            for (const key of Object.keys(_this.filters)) {
              if (key === 'name' || _this.filters[key] === undefined) {
                continue;
              }
              if (_this.filters[key] !== guest[key]) {
                return false;
              }
            }

            return true;
          });

          if (filteredGuests.length > 0) {
            filteredInvites.push(Object.assign({}, invite, { guests: filteredGuests }))
          }

          return filteredInvites;
        }, []);
      },
      guestCount() {
        return this.filteredInvites.reduce((guestCount, invite) => {
          return guestCount + invite.guests.length;
        }, 0);
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
      },
      clearFilters() {
        this.filters = defaultFilters();
      }
    }
  }
</script>

<style lang="scss" scoped>
  table {
    border-collapse: collapse;
  }
</style>

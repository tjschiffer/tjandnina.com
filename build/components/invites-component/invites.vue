<template>
  <div>
    <div class="tj-grid-flex">
      <div
        class="tj-grid-flex__cell-1-3
                  tj-grid-flex
                  tj-grid-flex--align-center
                  tj--margin-bottom-2"
      >
        <label
          for="filters.name"
          class="tj--white-space-no-wrap tj--margin-right-1"
        >
          Filter by Name:
        </label>
        <div class="tj-grid-flex__cell">
          <input
            id="filters.name"
            v-model="filters.name"
            type="text"
            class="tj-input tj--width-full"
          >
        </div>
      </div>
    </div>
    <div
      class="tj-grid-flex
                tj-grid-flex--align-center
                tj--margin-bottom-2"
    >
      <span class="tj--white-space-no-wrap tj--margin-right-1">
        Attending:
      </span>
      <div>
        <label class="tj--padding-hor-1">
          <input
            v-model="filters.attending"
            type="radio"
            name="attending"
            :value="1"
          > Yes
        </label>
        <label class="tj--padding-hor-1">
          <input
            v-model="filters.attending"
            type="radio"
            name="attending"
            :value="0"
          > No
        </label>
        <label class="tj--padding-hor-1">
          <input
            v-model="filters.attending"
            type="radio"
            name="attending"
            :value="null"
          > Has Not Responded
        </label>
      </div>
    </div>
    <div
      class="tj-grid-flex
                tj-grid-flex--align-center
                tj--margin-bottom-2"
    >
      <span class="tj--white-space-no-wrap tj--margin-right-1">
        Attending Welcome Event:
      </span>
      <div>
        <label class="tj--padding-hor-1">
          <input
            v-model="filters.attending_welcome_event"
            type="radio"
            name="attending_welcome_event"
            :value="1"
          > Yes
        </label>
        <label class="tj--padding-hor-1">
          <input
            v-model="filters.attending_welcome_event"
            type="radio"
            name="attending_welcome_event"
            :value="0"
          > No
        </label>
        <label class="tj--padding-hor-1">
          <input
            v-model="filters.attending_welcome_event"
            type="radio"
            name="attending_welcome_event"
            :value="null"
          > Has Not Responded
        </label>
      </div>
    </div>
    <div
      class="tj-grid-flex
                tj-grid-flex--align-center
                tj--margin-bottom-2"
    >
      <span class="tj--white-space-no-wrap tj--margin-right-1">
        Attending After Party:
      </span>
      <div>
        <label class="tj--padding-hor-1">
          <input
            v-model="filters.attending_after_party"
            type="radio"
            name="attending_after_party"
            :value="1"
          > Yes
        </label>
        <label class="tj--padding-hor-1">
          <input
            v-model="filters.attending_after_party"
            type="radio"
            name="attending_after_party"
            :value="0"
          > No
        </label>
        <label class="tj--padding-hor-1">
          <input
            v-model="filters.attending_after_party"
            type="radio"
            name="attending_after_party"
            :value="null"
          > Has Not Responded
        </label>
      </div>
    </div>

    <div class="tj-grid-flex tj-grid-flex--align-center tj--margin-bottom-2">
      <div>
        <button
          class="tj-button
                       tj-button--parisian-sky
                       tj--border-radius-3
                       tj--padding-hor-2
                       tj--padding-vert-1"
          @click="clearFilters"
        >
          Clear Filters
        </button>
      </div>
      <div class="tj--margin-left-auto tj--padding-hor-2">
        Guest Count: {{ guestCount }}
      </div>
    </div>

    <div
      v-if="errorMessage"
      class="tj--width-full
                tj--border-radius-3
                tj--bg-red
                tj--border-dark-gray
                tj--font-dark-gray
                tj--padding-1
                tj--text-align-center
                tj--margin-bottom-2"
      v-text="errorMessage"
    />
    <div
      v-else-if="loading"
      class="tj--text-align-center tj--margin-top-5"
    >
      <loading-dots />
    </div>
    <table
      v-else
      class="tj--width-full"
    >
      <tr>
        <th
          v-for="headerKey in allHeaderKeys"
          :key="headerKey"
          class="tj--border-dark-gray-1 tj--text-align-center tj--padding-1"
          v-text="headerKey.display"
        />
      </tr>
      <template
        v-for="invite in filteredInvites"
      >
        <tr :key="invite.invite_id">
          <td
            v-for="headerKey in headerKeysInvites"
            :key="headerKey"
            :rowspan="invite.guests.length"
            class="tj--border-dark-gray-1 tj--text-align-center tj--padding-1"
            v-text="invite[headerKey.key]"
          />
          <td
            v-for="headerKey in headerKeysGuests"
            :key="headerKey"
            class="tj--border-dark-gray-1 tj--text-align-center tj--padding-1"
            v-text="convertToBool(headerKey.type, invite.guests[0][headerKey.key])"
          />
        </tr>
        <tr
          v-for="guest in invite.guests.slice(1)"
          :key="guest.guest_id"
        >
          <td
            v-for="headerKey in headerKeysGuests"
            :key="headerKey"
            class="tj--border-dark-gray-1 tj--text-align-center tj--padding-1"
            v-text="convertToBool(headerKey.type, guest[headerKey.key])"
          />
        </tr>
      </template>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import loadingDots from '../../vue-components/loading-dots'
const defaultErrorMessage = 'An unknown error has occurred.'

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
]

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
]

const defaultFilters = () => {
  return {
    name: undefined,
    attending: undefined,
    attending_after_party: undefined,
    attending_welcome_event: undefined
  }
}

export default {
  name: 'Invites',
  components: {
    loadingDots
  },
  data () {
    return {
      invites: [],
      loading: true,
      errorMessage: null,
      headerKeysInvites: headerKeysInvites,
      headerKeysGuests: headerKeysGuests,
      filters: defaultFilters()
    }
  },
  computed: {
    allHeaderKeys () {
      return this.headerKeysInvites.concat(this.headerKeysGuests)
    },
    filteredInvites () {
      const _this = this
      return this.invites.reduce((filteredInvites, invite) => {
        const filteredGuests = invite.guests.filter(guest => {
          const fullNameLowerCase = (guest.first_name + ' ' + guest.last_name).toLowerCase()
          if (_this.filters.name && fullNameLowerCase.indexOf(_this.filters.name.toLowerCase()) === -1) {
            return false
          }

          for (const key of Object.keys(_this.filters)) {
            if (key === 'name' || _this.filters[key] === undefined) {
              continue
            }
            if (_this.filters[key] !== guest[key]) {
              return false
            }
          }

          return true
        })

        if (filteredGuests.length > 0) {
          filteredInvites.push(Object.assign({}, invite, { guests: filteredGuests }))
        }

        return filteredInvites
      }, [])
    },
    guestCount () {
      return this.filteredInvites.reduce((guestCount, invite) => {
        return guestCount + invite.guests.length
      }, 0)
    }
  },
  async beforeCreate () {
    try {
      const invitesResponse = await axios.post('/invites')
      this.invites = invitesResponse.data.invitesWithGuests
    } catch (err) {
      this.errorMessage = defaultErrorMessage
    }
    this.loading = false
  },
  methods: {
    convertToBool (type, val) {
      if (type === 'yes|no' && val === 0) {
        return 'No'
      }
      if (type === 'yes|no' && val === 1) {
        return 'Yes'
      }
      return val
    },
    clearFilters () {
      this.filters = defaultFilters()
    }
  }
}
</script>

<style lang="scss" scoped>
  table {
    border-collapse: collapse;
  }
</style>

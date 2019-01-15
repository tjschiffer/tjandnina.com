import navigation from './components/navigation-component/navigation'
import rsvp from './components/rsvp-component/rsvp'
import login from './components/login-component/login'
import invites from './components/invites-component/invites'

window.onload = () => {
  navigation()
  rsvp()
  login()
  invites()
}

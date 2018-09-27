import navigation from './components/navigation-component/navigation';
import rsvp from './components/rsvp-component/rsvp';

window.onload = () => {
  navigation(document.body);
  rsvp(document.body);
};

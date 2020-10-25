import Home from '../views/Dashboard.vue';
import Gallery from '../views/Gallery.vue';
import Settings from '../views/Settings.vue';
import About from '../views/About.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/Gallery',
    component: Gallery,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
];

export default routes;

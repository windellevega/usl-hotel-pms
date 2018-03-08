import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Main from '@/components/Main.vue'
import Booking from '@/components/layouts/Main/Booking.vue'
import Reservation from '@/components/layouts/Main/Reservation.vue'
import Customers from '@/components/layouts/Main/Guests.vue'
import Rooms from '@/components/layouts/Main/Rooms.vue'
import Accounts from '@/components/layouts/Main/Accounts.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
      children: [
          {
            path: '/booking',
            name: 'Booking',
            component: Booking,
          },
          {
            path: '/reservation',
            name: 'Reservation',
            component: Reservation,
          },
          {
            path: '/guests',
            name: 'Guests',
            component: Customers,
          },
          {
            path: '/rooms',
            name: 'Rooms',
            component: Rooms,
          },
          {
            path: '/accounts',
            name: 'Accounts',
            component: Accounts,
          }
      ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
      }
  ]
});

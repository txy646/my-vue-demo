import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/game'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/LoginView.vue')
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('./views/GameView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/location/:id',
    name: 'Location',
    component: () => import('./views/LocationView.vue')
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('./views/Leaderboard.vue')
  },
  {
    path: '/user',
    name: 'UserManagement',
    component: () => import('./views/UserManagement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 先注释掉所有路由守卫，确保基础功能正常
// router.beforeEach((to, from, next) => {
//   const userStore = useUserStore()
//   
//   if (to.meta.requiresAuth && !userStore.isLoggedIn) {
//     next('/login')
//   } else {
//     next()
//   }
// })

export default router
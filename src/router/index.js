import { createRouter, createWebHistory } from 'vue-router'
import TodoList from '../components/TodoList.vue'
import FocusMode from '../components/FocusMode.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Notes from '../components/Notes.vue'

const routes = [
  {
    path: '/',
    name: 'TodoList',
    component: TodoList,
    meta: { requiresAuth: true }
  },
  {
    path: '/focus',
    name: 'FocusMode',
    component: FocusMode,
    meta: { requiresAuth: true }
  },
  {
    path: '/notes',
    name: 'Notes',
    component: Notes,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guest: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStr = localStorage.getItem('currentUser')
  const isAuthenticated = !!userStr && JSON.parse(userStr)
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (isAuthenticated) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 
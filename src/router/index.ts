import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import CasesPerCountry from '@/components/CasesPerCountry.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'vue-chartkick',
    component: CasesPerCountry
  }
]

const router = new VueRouter({
  routes
})

export default router

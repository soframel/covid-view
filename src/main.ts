import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { LuxParkingServer } from './services/LuxParkingServer'

Vue.config.productionTip = false

const server=new LuxParkingServer()

new Vue({
  router,
  provide(){
    return {
      server: server
    }
  },
  render: h => h(App)
}).$mount('#app')

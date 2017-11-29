import Vue from 'vue'
import Router from 'vue-router'
//import menuModule from '@/store/modules/menu'
import {Login,Home,AppFnd} from '@/views/'
import lazyLoading from './lazyLoading'
import fnd from './fnd'

Vue.use(Router)

export default new Router({
  mode: 'hash', // Demo is living in GitHub.io, so required!
  linkActiveClass: 'is-active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
     {
      name  : 'index',
      path  : '/',
      hidden: true,
      redirect(to){
          return 'login';
      }
    },
    {
      name: 'Login',
      path: '/login',
      component: Login,
      meta: {
        title: '用户登录'
      },
    },
    {
      name: 'app',
      path: '',
      icon: 'inbox',
      component: Home,
      beforeEnter: (to, from, next) => {
          next()
      },
      redirect: '/app/fnd/dashboard',
      children: [
        ...generateRoutesFromApp(fnd)
      ]
    },
    {
      path: '*',
      name: '404',
      component: lazyLoading('Page404.vue'),
      meta: {
        title: '404'
      },
    }
  ]
})

// Menu should have 2 levels.
/*function generateRoutesFromMenu (menu = [], routes = []) {
  console.log(menu)
  for (let i = 0, l = menu.length; i < l; i++) {
    let item = menu[i]
    console.log(item)
    if (item.path) {
      routes.push(item)
    }
    if (!item.component) {
      generateRoutesFromMenu(item.children, routes)
    }
  }
  return routes
}*/

function generateRoutesFromApp (app = {}, routes = []) {
  Object.keys(app).forEach(function(context){
    //console.log(context+':'+JSON.stringify(app[context]))
    let cmp=app[context]
    if(cmp.path){
      let item={
        name: context,
        path: cmp.path,
        meta: {
          title: cmp.title
        },
        component: lazyLoading(context+'.vue') //app[context] // lazyLoading(app[context].__file)
      }
      routes.push(item)
    }else{
      console.log(cmp)
      console.error(cmp.name+'-->cmp.path 属性为空！')
    }
  })

  /*
  for (let i = 0, l = menu.length; i < l; i++) {
    let item = menu[i]
    console.log(item)
    if (item.path) {
      routes.push(item)
    }
    if (!item.component) {
      generateRoutesFromMenu(item.children, routes)
    }
  }*/
  return routes
}



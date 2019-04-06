import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Register from './views/Register'
import Nofind from './views/404'
import Login from './views/Login'
import Home from './views/Home'
import userInfo from './views/userInfo'
import myArticle from './views/myArticle'
import Cookies from 'js-cookie'
import membersInfo from './views/membersInfo'
import message from './views/message'
import MeetInfo from './views/MeetInfo'
import msgMangent from './views/msgMangent'
 import ArtcileReword from './views/ArtcileReword'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '*', name: '/404', component: Nofind },
    { path: '/', redirect: '/index' },
    { path: '/register', name: 'register', component: Register },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        { path: '', component: Home },
        { path: '/home', name: 'home', component: Home },
        { path: '/userInfo', name: 'userInfo', component: userInfo },
        { path: '/myArticle', name: 'myArticle', component: myArticle },
        { path: '/membersInfo', name: 'membersInfo', component: membersInfo },
        { path: '/MeetInfo', name: 'MeetInfo', component: MeetInfo },
        { path: '/message', name: 'message', component: message },
        { path: '/msgMangent', name: 'msgMangent', component: msgMangent },
        { path: '/ArtcileReword', name: 'ArtcileReword', component: ArtcileReword },
      ]
    },

    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})

//添加路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = Cookies.get('user') ? true : false;
  const isAdmin = Cookies.get('level') ? true : false;

  if (to.path == "/login" || to.path == "/register") {
    next();
  } else {
    isLogin ? next() : next("/login");
  }
  if (to.path == "/msgMangent" || to.path == "/membersInfo") {
    if(isAdmin){
      next();
    }else {
      next(from.path);
      alert("权限不足")
    }

  }


})

export default router;

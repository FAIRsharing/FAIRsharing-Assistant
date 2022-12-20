import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import {
  HomeView,
  ResourceTypeView,
  SubjectTypeView,
  DomainTypeView
} from './routes'


let routes = [
  {
    name: "HomeView",
    path: "/",
    component: HomeView,
  },
  {
    name: "ResourceTypeView",
    path: "/resource",
    component: ResourceTypeView,

  },
  {
    name: "SubjectTypeView",
    path: "/subject",
    component: SubjectTypeView,
  },
  {
    name: "DomainTypeView",
    path: "/domain",
    component: DomainTypeView,
  }
]


const router = new VueRouter({
  mode: 'history',
  routes,
  // mode: process.env.VUE_APP_MODE // "history" or "hash"
});

export default router;
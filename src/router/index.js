import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import {
  HomeView,
  ResourceTypeView,
  SubjectTypeView,
  DomainTypeView,
  DatabaseView,
  StandardsView,
  PoliciesView,
  RefineView
} from './routes'

import Flowchart from '@/views/Flowchart/Flowchart.vue'

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
  },
  {
    name: "DatabaseView",
    path: "/database",
    component: DatabaseView,
  },
  {
    name: "StandardsView",
    path: "/standards",
    component: StandardsView,
  },
  {
    name: "PoliciesView",
    path: "/policies",
    component: PoliciesView,
  },
  {
    name: "RefineView",
    path: "/refine-my-choice",
    component: RefineView,
  },
  {
    name: "Flowchart",
    path: "/flowchart",
    component: Flowchart
  }
]


const router = new VueRouter({
  mode: 'history',
  routes,
  // mode: process.env.VUE_APP_MODE // "history" or "hash"
});

export default router;
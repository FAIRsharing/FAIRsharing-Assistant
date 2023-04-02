import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import {
  HomeView,
  ResourceTypeView,
  SubjectTypeView,
  // SubjectTypeView_1,
  SubjectTypeViewD3JS,
  DomainTypeView,
  DomainTypeViewD3JS,
  DatabaseView,
  StandardsView,
  PoliciesView,
  RefineView
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
  // {
  //   name: "SubjectTypeView_1",
  //   path: "/subject_1",
  //   component: SubjectTypeView_1,
  // },
  {
    name: "SubjectTypeViewD3JS",
    path: "/subjectd3js",
    component: SubjectTypeViewD3JS,
  },
  {
    name: "DomainTypeView",
    path: "/domain",
    component: DomainTypeView,
  },
  {
    name: "DomainTypeViewD3JS",
    path: "/domaind3js",
    component: DomainTypeViewD3JS,
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
  }
]


const router = new VueRouter({
  mode: 'history',
  routes,
  // mode: process.env.VUE_APP_MODE // "history" or "hash"
});

export default router;
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import {
  HomeView,
  SubjectTypeView,
  DomainTypeView,
  DatabaseView,
  StandardsView,
  PoliciesView,
  RefineView,
  ResultView,
  NotFound,
  ServerError,
  Licence,
  AllTags,
  RefineRegistry
} from './routes'

let routes = [
  // See below for further questions...
  {
    name: "HomeView",
    path: "/:id(\\d+)?",
    component: HomeView,
  },
  {
    name: "AllTags",
    path: "/researchfields",
    component: AllTags,
  },
  {
    name: "RefineRegistry",
    path: "/refineregistry",
    component: RefineRegistry,
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
    name: "ResultView",
    path: "/results",
    component: ResultView
  },
  {
    name: "Licence",
    path: "/licence",
    component: Licence,
  },
  /* ERROR HANDLING */
  {
    name: "Error 404",
    path: "/error/404",
    component: NotFound
  },
  /* SERVER ERROR HANDLING */
  {
    name: "Error 500",
    path: "/error/500",
    component: ServerError
  },
  /* REDIRECTION */
  {
    name: "*",
    path: "*/*",
    component: NotFound
  }
]


const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
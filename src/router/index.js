import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import {
  HomeView,
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
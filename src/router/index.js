import { createWebHistory, createRouter } from "vue-router";

import {
  HomeView,
  SplashScreen,
  ResultView,
  NotFound,
  ServerError,
  Licence,
  AllTags,
  RefineRegistry,
  RefineFromQuestions,
  Educational,
  Maintenance,
} from "./routes";

let routes = [
  // See below for further questions...
  {
    name: "SplashScreen",
    path: "/",
    component: SplashScreen,
  },
  {
    name: "HomeView",
    path: "/:id(\\d+)",
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
    name: "RefineFromQuestions",
    path: "/refine",
    component: RefineFromQuestions,
  },
  {
    name: "ResultView",
    path: "/results",
    component: ResultView,
  },
  {
    name: "Licence",
    path: "/licence",
    component: Licence,
  },
  {
    name: "Educational",
    path: "/educational/:text",
    component: Educational,
  },
  /* ERROR HANDLING */
  {
    name: "Error 404",
    path: "/error/404",
    meta: { title: "FAIRassist | Not Found" },
    component: NotFound,
  },
  /* SERVER ERROR HANDLING */
  {
    name: "Error 500",
    path: "/error/500",
    meta: { title: "FAIRassist | Server Error" },
    component: ServerError,
  },
  /* REDIRECTION */
  {
    name: "*",
    path: "/*/*",
    component: NotFound,
  },
  /* MAINTENANCE */
  {
    name: "Maintenance",
    path: "/error/maintenance",
    meta: { title: "FAIRassist | Maintenance Mode" },
    component: Maintenance,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const DEFAULT_TITLE = "FAIRassist";
router.beforeEach((to) => {
  document.title = to.meta.title || DEFAULT_TITLE;
});

export default router;

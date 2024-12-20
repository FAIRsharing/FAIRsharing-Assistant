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
    meta: { title: 'FAIRassist | Not Found TEST' },
    component: NotFound,
  },
  /* SERVER ERROR HANDLING */
  {
    name: "Error 500",
    path: "/error/500",
    component: ServerError,
  },
  /* REDIRECTION */
  {
    name: "*",
    path: "/*/*",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  document.title = to.meta.title;
});

export default router;

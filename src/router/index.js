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
    meta: {title: "FAIRassist | Home"},
    component: SplashScreen,
  },
  {
    name: "HomeView",
    path: "/:id(\\d+)",
    meta: {title: "FAIRassist | Questions"},
    component: HomeView,
  },
  {
    name: "AllTags",
    path: "/researchfields",
    meta: {title: "FAIRassist | ResearchFields"},
    component: AllTags,
  },
  {
    name: "RefineRegistry",
    path: "/refineregistry",
    meta: {title: "FAIRassist | Refine Registry"},
    component: RefineRegistry,
  },
  {
    name: "RefineFromQuestions",
    path: "/refine",
    meta: {title: "FAIRassist | Refine Your Choice"},
    component: RefineFromQuestions,
  },
  {
    name: "ResultView",
    path: "/results",
    meta: {title: "FAIRassist | Results"},
    component: ResultView,
  },
  {
    name: "Licence",
    path: "/licence",
    meta: {title: "FAIRassist | Licence"},
    component: Licence,
  },
  {
    name: "Educational",
    path: "/educational/:text",
    meta: {title: "FAIRassist | Educational"},
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
    meta: { title: "FAIRassist | NotFound" },
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


router.beforeEach((to) => {
  const { title, description } = to.meta;
  const DEFAULT_TITLE = "FAIRassist";
  const DEFAULT_DESCRIPTION = "FAIRsharing is a curated informative and educational resource on data and metadata standards, inter-related to databases and data policies. This Assistant will help you find the standards, databases and policies you need to help make your data FAIR.";
  const descriptionElement = document.querySelector('head meta[name="description"]')
  document.title = title || DEFAULT_TITLE;
  descriptionElement.setAttribute('content', description || DEFAULT_DESCRIPTION)
});

export default router;

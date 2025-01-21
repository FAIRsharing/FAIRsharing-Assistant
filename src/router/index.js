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
  {
    name: "SplashScreen",
    path: "/",
    meta: {title: "FAIRassist | Home"},
    component: SplashScreen,
  },
  {
    name: "HomeView",
    path: "/:id(\\d+)",
    meta: {
      title: "FAIRassist | Questions",
      description: "The FAIRsharing assistant will ask you a series of questions so that we can find the resources you need."
    },
    component: HomeView,
  },
  {
    name: "AllTags",
    path: "/researchfields",
    meta: {
      title: "FAIRassist | ResearchFields",
      description: "By selecting the relevant subjects, domains and (if applicable) taxonomy, the Assistant will narrow your search to the records that most closely match your needs.",
    },
    component: AllTags,
  },
  {
    name: "RefineRegistry",
    path: "/refineregistry",
    meta: {
      title: "FAIRassist | Refine Registry",
      description: "Here, you may select further properties of the FAIRsharing registries of interest to you."
    },
    component: RefineRegistry,
  },
  {
    name: "RefineFromQuestions",
    path: "/refine",
    meta: {
      title: "FAIRassist | Refine Your Choice",
      description: "By selecting relevant values here the Assistant will narrow your search to the records that most closely match your needs.",
    },
    component: RefineFromQuestions,
  },
  {
    name: "ResultView",
    path: "/results",
    meta: {
      title: "FAIRassist | Results",
      description: "This page has the results of your search on the FAIRsharing assistant.",
    },
    component: ResultView,
  },
  {
    name: "Licence",
    path: "/licence",
    meta: {
      title: "FAIRassist | Licence",
      description: "Except where otherwise noted, content on this site is licensed under a Creative Commons Attribution and Share-alike (CC-BY-SA) International 4.0 licence."
    },
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
    meta: {
      title: "FAIRassist | Not Found",
      description: "FAIRsharing Assistant: Page not found."
    },
    component: NotFound,
  },
  /* SERVER ERROR HANDLING */
  {
    name: "Error 500",
    path: "/error/500",
    meta: {
      title: "FAIRassist | Server Error",
      desscription: "FAIRsharing Assistant: Internal server error.",
    },
    component: ServerError,
  },
  /* REDIRECTION */
  {
    name: "*",
    path: "/*/*",
    meta: {
      title: "FAIRassist | NotFound",
      description: "FAIRsharing Assistant: Page not found.",
    },
    component: NotFound,
  },
  /* MAINTENANCE */
  {
    name: "Maintenance",
    path: "/error/maintenance",
    meta: {
      title: "FAIRassist | Maintenance Mode",
      description: "The FAIRsharing Assistant is currently undergoing maintenance. Please accept our apologies for any inconvenience.",
    },
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

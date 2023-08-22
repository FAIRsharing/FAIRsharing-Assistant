export const HomeView = () => import('@/views/Home/HomeView.vue');
export const NotFound = () => import(/* webpackChunkName: "notFound-chunk" */  "@/views/Errors/404");
export const ServerError = () => import(/* webpackChunkName: "serverError-chunk" */  "@/views/Errors/500");
export const Licence =  () => import(/* webpackChunkName: "licence-chunk" */ '@/views/Licence/Licence');
export const ResultView = () => import('@/views/Results/ResultView.vue');
export const AllTags = () => import('@/views/AllTags/AllTags.vue');
export const RefineRegistry = () => import('@/views/RefineRegistry/RefineRegistry.vue');


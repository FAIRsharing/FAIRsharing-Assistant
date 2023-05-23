export const HomeView = () => import('@/views/Home/HomeView.vue');
export const SubjectTypeView = () => import('@/views/Subject/SubjectTypeView.vue');
export const DomainTypeView = () => import('@/views/Domain/DomainTypeView.vue');
export const DatabaseView = () => import('@/views/Resource/DatabaseView.vue');
export const StandardsView = () => import('@/views/Resource/StandardsView.vue');
export const PoliciesView = () => import('@/views/Resource/PoliciesView.vue');
export const RefineView = () => import('@/views/Navigation/RefineView.vue');
export const NotFound = () => import(/* webpackChunkName: "notFound-chunk" */  "@/views/Errors/404");
export const ServerError = () => import(/* webpackChunkName: "serverError-chunk" */  "@/views/Errors/500");


import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import {
    HomeView,
    ResourceTypeView,
    SubjectTypeView,
    SunBurstView,
    DomainTypeView,
    // TabsView
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
    {
        name: "DomainTypeView",
        path: "/domain",
        component: DomainTypeView,

    },
    {
        name: "SunBurstView",
        path: "/sunburst",
        component: SunBurstView,
    },
]


const router = new VueRouter({
    mode: 'history',
    routes,
    // mode: process.env.VUE_APP_MODE // "history" or "hash"
});

export default router;
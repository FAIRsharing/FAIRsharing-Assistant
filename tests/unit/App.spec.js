import {shallowMount, createLocalVue} from "@vue/test-utils";
import App from "@/App.vue";
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
let $route = { path: "/", name: "HomeView"};


describe("App.vue", () => {
  let wrapper;
  const vuetify = new Vuetify();

  it("can be instantiated", async () => {
    const title = "App";
    wrapper = await shallowMount(App, {
      localVue,
      vuetify,
      mocks: {$route},
      stubs: ['router-link', 'router-view']
    });
    wrapper.vm.loading = false
    expect(wrapper.vm.$options.name).toMatch(title);
  });

});

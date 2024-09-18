import { shallowMount } from "@vue/test-utils";
import App from "@/App.vue";
import { createApp } from "vue";
import { createVuetify } from "vuetify";

const vuetify = createVuetify({});
const localVue = createApp();
localVue.use(vuetify);
let $route = { path: "/", name: "HomeView" };

describe("App.vue", () => {
  let wrapper;

  it("can be instantiated", async () => {
    const title = "App";
    wrapper = shallowMount(App, {
      localVue,
      vuetify,
      mocks: { $route },
      stubs: ["router-link", "router-view"],
    });
    wrapper.vm.loading = false;
    expect(wrapper.vm.$options.name).toMatch(title);
  });
});

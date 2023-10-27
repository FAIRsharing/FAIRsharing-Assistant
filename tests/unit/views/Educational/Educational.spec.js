import {createLocalVue, shallowMount} from "@vue/test-utils";
import Educational from "@/views/Educational/Educational.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";
import navigationStore from "@/store/navigationStore";

const $router = { push: jest.fn() };
let $route = {
  path: "/educational/claim",
  params: {
    text: "claim"
  }
};

const localVue = createLocalVue();
localVue.use(Vuex);

let store;

navigationStore.getters = {
  getBreadcrumbs() {
    return []
  }
}

store = new Vuex.Store({
  modules: {
    navigationStore: navigationStore
  }
})

const vuetify = new Vuetify();

describe("Educational.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Educational, {
      localVue,
      vuetify,
      store,
      mocks: { $router, $route },
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Educational");
  });

});
import {createLocalVue, shallowMount} from "@vue/test-utils";
import GoHome from "@/components/AllTags/GoHome"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();

let actions = {
  resetMultiTags: jest.fn()
}

let store = new Vuex.Store({
  modules: {
    actions
  },

})

describe("GoHome.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(GoHome, {
      localVue,
      vuetify,
      store,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("GoHome");
  });

});

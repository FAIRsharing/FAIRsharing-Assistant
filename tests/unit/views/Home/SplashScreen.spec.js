import {createLocalVue, shallowMount} from "@vue/test-utils";
import SplashScreen from "@/views/Home/SplashScreen.vue"
import multiTagsStore from "@/store/multiTagsStore";
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
    actions,
    multiTagsStore: multiTagsStore
  },

})


describe("SplashScreen.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SplashScreen, {
      localVue,
      vuetify,
      store,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SplashScreen");
  });

});
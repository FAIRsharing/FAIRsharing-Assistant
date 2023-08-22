import {createLocalVue, shallowMount} from "@vue/test-utils";
import RegistryButton from "@/components/Navigation/RegistryButton.vue"
import Vuetify from "vuetify"
import multiTagsStore from "@/store/multiTagsStore";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

multiTagsStore.getters = {
  getRefinedStatus: () => { return true },
}

let store = new Vuex.Store({
  modules: {
    multiTagsStore: multiTagsStore,
  },
})

describe("RegistryButton.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RegistryButton, {
      localVue,
      vuetify,
      store,
      stubs: ['router-link']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RegistryButton");
  });

});
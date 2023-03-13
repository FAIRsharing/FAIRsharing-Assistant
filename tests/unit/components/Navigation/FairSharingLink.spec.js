import {createLocalVue, shallowMount} from "@vue/test-utils";
import FairSharingLink from "@/components/Navigation/FairSharingLink"
import Vuetify from "vuetify"
import Vuex from "vuex";
import bubbleSelectedStore from "@/store/bubbleSelectedStore.js";
import VueRouter from "vue-router"

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();
const router = new VueRouter();

const $store = new Vuex.Store({
  modules: {
    bubbleSelectedStore: bubbleSelectedStore,
  }
});

describe("FairSharingLink.vue", function(){
  let wrapper;

  beforeAll(() => {
    wrapper = shallowMount(FairSharingLink, {
      localVue,
      vuetify,
      router,
      propsData: {
        fairSharingButton: false
      },
      mocks:{$store},
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("FairSharingLink");
  });

});

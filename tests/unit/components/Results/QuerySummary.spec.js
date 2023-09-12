import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"
import QuerySummary from "@/components/Results/QuerySummary.vue"
import multiTagsStore from "@/store/multiTagsStore";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

let vuetify = new Vuetify();

multiTagsStore.getters = {
  getQueryParams:  () => {
    return {
      subjects: ['genetics'],
      registry: ['standard']
    }
  },
  getCurrentRegistry: () => { return "database" }
}

let store = new Vuex.Store({
  modules: {
    multiTagsStore: multiTagsStore,
  }
})

describe("QuerySummary.vue", function () {
  let wrapper;

  wrapper = shallowMount(QuerySummary, {
    localVue,
    vuetify,
    store
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("QuerySummary");
  });

});

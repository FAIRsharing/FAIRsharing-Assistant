import {createLocalVue, shallowMount} from "@vue/test-utils";
import Tooltip from "@/components/Others/Tooltip.vue";
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();

describe("Tooltip.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Tooltip, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Tooltip");
  });

});

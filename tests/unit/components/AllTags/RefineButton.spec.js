import {createLocalVue, shallowMount} from "@vue/test-utils";
import RefineButton from "@/components/AllTags/RefineButton.vue"
import Vuetify from "vuetify"

const localVue = createLocalVue();

const vuetify = new Vuetify();

describe("RefineButton.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RefineButton, {
      localVue,
      vuetify,
      stubs: ['router-link']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RefineButton");
  });

});
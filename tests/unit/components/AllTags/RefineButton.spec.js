import {createLocalVue, shallowMount} from "@vue/test-utils";
import RefineButton from "@/components/AllTags/RefineButton.vue"
import Vuetify from "vuetify"
import icons from "@/plugins/icons";

const localVue = createLocalVue();

const vuetify = new Vuetify({'icons':icons});

describe("EditTags.vue", function(){
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
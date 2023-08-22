import {createLocalVue, shallowMount} from "@vue/test-utils";
import EditTags from "@/components/AllTags/EditTags.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();

describe("EditTags.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(EditTags, {
      localVue,
      vuetify
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("EditTags");
  });
});
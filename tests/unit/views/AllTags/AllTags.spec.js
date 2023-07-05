import {createLocalVue, shallowMount} from "@vue/test-utils";
import AllTags from "@/views/AllTags/AllTags.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();


describe("AllTags.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(AllTags, {
      localVue,
      vuetify
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("AllTags");
  });

});
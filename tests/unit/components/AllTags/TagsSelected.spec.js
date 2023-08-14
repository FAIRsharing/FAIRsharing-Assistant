import {createLocalVue, shallowMount} from "@vue/test-utils";
import TagsSelected from "@/components/AllTags/TagsSelected"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();


describe("TagsSelected.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TagsSelected, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("TagsSelected");
  });

});

import {createLocalVue, shallowMount} from "@vue/test-utils";
import EditTags from "@/components/AllTags/EditTags.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";
import icons from "@/plugins/icons";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify({'icons':icons});

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
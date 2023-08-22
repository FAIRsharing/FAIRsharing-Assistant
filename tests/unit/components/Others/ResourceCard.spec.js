import {createLocalVue, shallowMount} from "@vue/test-utils";
import ResourceCard from "@/components/Others/ResourceCard.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";
import icons from "@/plugins/icons";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify({'icons':icons});

describe("ResourceCard.vue", function(){
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(ResourceCard, {
      localVue,
      vuetify,
      propsData:{
        registryIcon: "home_standard"
      },
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ResourceCard");
  });

});

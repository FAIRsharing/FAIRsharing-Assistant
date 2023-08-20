import {createLocalVue, shallowMount} from "@vue/test-utils";
import Footer from "@/components/Others/Footer.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();


describe("Footer.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Footer, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Footer");
  });

});

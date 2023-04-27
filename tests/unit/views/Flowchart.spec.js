import {createLocalVue, shallowMount} from "@vue/test-utils";
import Flowchart from "@/views/Flowchart/Flowchart.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();


describe("Flowchart.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Flowchart, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Flowchart");
  });

});

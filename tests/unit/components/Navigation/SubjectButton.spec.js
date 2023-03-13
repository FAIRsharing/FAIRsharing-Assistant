import {createLocalVue, shallowMount} from "@vue/test-utils";
import SubjectButton from "@/components/Navigation/SubjectButton"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();


describe("SubjectButton.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SubjectButton, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SubjectButton");
  });

});

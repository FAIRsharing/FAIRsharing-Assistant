import {createLocalVue, shallowMount} from "@vue/test-utils";
import Jumbotron from "@/components/Navigation/Jumbotron"
import Vuetify from "vuetify"
import VueSanitize from "vue-sanitize";

const localVue = createLocalVue();
localVue.use(VueSanitize)

const vuetify = new Vuetify();
let $route = { path: "/", name: "HomeView"};


describe("Jumbotron.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Jumbotron, {
      localVue,
      vuetify,
      mocks: { $route},
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Jumbotron");
  });

});

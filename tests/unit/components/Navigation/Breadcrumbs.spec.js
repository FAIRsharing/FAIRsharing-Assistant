import {createLocalVue, shallowMount} from "@vue/test-utils";
import Breadcrumbs from "@/components/Navigation/Breadcrumbs.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";
import icons from "@/plugins/icons";
import navigationStore from "@/store/navigationStore";

const localVue = createLocalVue();
localVue.use(Vuex);
let $route = {
  path: "/",
  name: "HomeView",
  params:{
    id: 0
  }
};

const vuetify = new Vuetify({'icons':icons});

navigationStore.getters = {
  getBreadcrumbs: () => {
    return [
      {
        link: '/1',
        text: 'a link'
      }
    ]
  },
  getCompliantWith: () => { return "GenbankSequenceFormat" },
}

let store = new Vuex.Store({
  modules: {
    //actions,
    navigationStore: navigationStore
  },
})


describe("Breadcrumbs.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Breadcrumbs, {
      localVue,
      vuetify,
      store,
      mocks: { $route },
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Breadcrumbs");
  });

});

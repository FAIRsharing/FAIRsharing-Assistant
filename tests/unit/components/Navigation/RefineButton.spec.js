import {createLocalVue, shallowMount} from "@vue/test-utils";
import RefineButton from "@/components/Navigation/RefineButton"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();


describe("RefineButton", function(){
  let wrapper, getters, store;

  beforeEach(() => {
    getters = {
      getNodes: () => {
        return[
          {
            records: "Policies",
            recordsNumber: 164,
            type: "resourceParent"
          }
        ]
      }
    }

    store = new Vuex.Store({
      getters
    })

    wrapper = shallowMount(RefineButton, {
      localVue,
      vuetify,
      store,
      computed:{
        isObjEmpty(){
          return true
        }
      },
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RefineButton");
  });

});

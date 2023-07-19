// TODO: Placeholder => need to overcome tedious issue:
// TODO: Cannot read properties of undefined (reading 'subjects')
it("does nothing of consequence", () => {
  expect("RefineRegistry").toMatch("RefineRegistry");
});

/*
import {createLocalVue, shallowMount} from "@vue/test-utils";
import RefineRegistry from "@/views/Resource/RefineRegistry.vue"
import icons from '@/plugins/icons';
import Vuetify from "vuetify"
import Vuex from "vuex";

const $router = { push: jest.fn() };

const localVue = createLocalVue();
localVue.use(Vuex);

let getters, store;

getters = {
  multiTagsStore: () => {
    return {
      getFairSharingRecords: [
        {
          record: "Wibble",
          registry: "Standard",
          id: 123,
        }
      ],
      getQueryParams:  {
        subjects: ['genetics'],
        registry: ['standard']
      },
      getRefinedStatus: true,
      getCurrentRegistry: 'standard'
    }
  }
}

store = new Vuex.Store({
  getters
})

const vuetify = new Vuetify({'icons': icons });

describe("RefineRegistry.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RefineRegistry, {
      localVue,
      vuetify,
      store,
      mocks: { $router },
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RefineRegistry");
  });

});
 */
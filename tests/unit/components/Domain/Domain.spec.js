import {createLocalVue, shallowMount} from "@vue/test-utils";
import DomainType from "@/components/Domain/DomainType.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";
import addOnFilterSelectedStore from "@/store/addOnFilterSelectedStore"
import breadCrumbStore from "@/store/breadCrumbStore"
import nodeListStore from "@/store/nodeListStore"
import recordTypeStore from "@/store/recordTypeStore"

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();

const recordArray = ["A", "B", "C"]

describe("DomainType.vue", function(){
  let wrapper, state, store, actions;

  beforeEach(() => {
    state = {
      allRecordTypes: {
        records:[
          {
            fairsharingRegistry:{
              id:2,
              name: "Database"
            },
            id:1,
            name:"repository"
          }
        ]
      },
      loadingData: false,
      variableResponse: ["V1", "V2"],
      loadingStatus: false,
    }
    addOnFilterSelectedStore.getters = {
      getFilters: () => {
        return [
          {
            status: "Ready",
          }
        ]
      },
    }
    breadCrumbStore.getters = {
      getBreadCrumbs: () => {
        return["A", "B"]
      },
    }
    nodeListStore.getters = {
      getNodeList: () => {
        return[
          {
            resourceNodeList: ["R1", "R2"],
            subjectNodeList: ["S1", "S2"],
            domainNodeList: ["D1", "D2"]
          }
        ]
      }
    }
    actions = {
      leavePage: jest.fn(),
      fetchAllRecordTypes: jest.fn(),
      resetRecords: jest.fn(),
      fetchVariableTags: jest.fn(),
      resetVariableTags: jest.fn(),
      resetbreadCrumbs: jest.fn()
    }
    store = new Vuex.Store({
      modules: {
        namespaced: true,
        state,
        actions,
        addOnFilterSelectedStore: addOnFilterSelectedStore,
        breadCrumbStore: breadCrumbStore,
        nodeListStore: nodeListStore,
        recordTypeStore: recordTypeStore,
      }
    })

    wrapper = shallowMount(DomainType, {
      localVue,
      vuetify,
      store,
      mocks: {recordArray},
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("DomainType");
  });

});
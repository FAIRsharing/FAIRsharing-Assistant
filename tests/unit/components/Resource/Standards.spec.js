import {createLocalVue, shallowMount} from "@vue/test-utils";
import Standards from "@/components/Resource/Standards.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";
import breadCrumbStore from "@/store/breadCrumbStore"
import nodeListStore from "@/store/nodeListStore"
import recordTypeStore from "@/store/recordTypeStore"
import otherResourcesSelectedStore from "@/store/otherResourcesSelectedStore"
import bubbleSelectedStore from "@/store/bubbleSelectedStore"

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();

const recordArray = ["A", "B", "C"]

describe("Standards.vue", function(){
  let wrapper, state, store, actions;

  beforeEach(() => {
    state = {
      allRecordTypes: {
        records:[
          {
            fairsharingRegistry:{
              id:2,
              name: "Standards"
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
    breadCrumbStore.getters = {
      getBreadCrumbs: () => {
        return["C", "X"]
      },
    }
    nodeListStore.getters = {
      getNodeList: () => {
        return[
          {
            resourceNodeList: ["R6", "R2"],
            subjectNodeList: ["S15", "S2"],
            domainNodeList: ["D1", "D2"]
          }
        ]
      }
    }
    otherResourcesSelectedStore.getters = {
      getOtherResourceSelected: () => {
        return[
          {
            level:2,
            name:"MNO",
            records_count:90,
            tree_id:3
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
      resetbreadCrumbs: jest.fn(),
      resetOtherResourceSelected: jest.fn(),
      resetAllResources: jest.fn()
    }
    store = new Vuex.Store({
      modules: {
        namespaced: true,
        state,
        actions,
        breadCrumbStore: breadCrumbStore,
        nodeListStore: nodeListStore,
        recordTypeStore: recordTypeStore,
        bubbleSelectedStore: bubbleSelectedStore
      }
    })

    wrapper = shallowMount(Standards, {
      localVue,
      vuetify,
      store,
      mocks: {recordArray},
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Standards");
  });

});
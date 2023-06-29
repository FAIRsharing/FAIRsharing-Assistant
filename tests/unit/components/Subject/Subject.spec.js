import {createLocalVue, shallowMount} from "@vue/test-utils";
import SubjectType from "@/components/Subject/SubjectType.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";
import addOnFilterSelectedStore from "@/store/addOnFilterSelectedStore"
import breadCrumbStore from "@/store/breadCrumbStore"
import nodeListStore from "@/store/nodeListStore"
import recordTypeStore from "@/store/recordTypeStore"
import browseSubjectsStore from "@/store/browseSubjectsStore";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();

const recordArray = ["A", "B", "C"]

describe("SubjectType.vue", function(){
  let wrapper, state, store, actions;

  beforeEach(() => {
    state = {
      allRecordTypes: {
        records:[
          {
            fairsharingRegistry:{
              id:2,
              name: "Subject"
            },
            id:1,
            name:"repository"
          }
        ]
      },
      loadingData: false,
      variableResponse: ["V1", "V2"],
      loadingStatus: false,
      subjectBubbleTree: [
        {
          id: 468,
          tree_id: 1,
          name: "Engineering Science",
          records_count: 1377,
          children: [
            {
              id: 2323,
              tree_id: 1,
              name: "XCF Science",
              records_count: 77,
            }
          ]
        },
      ]
    }
    addOnFilterSelectedStore.getters = {
      getFilters: () => {
        return [
          {
            status: "Not Ready",
          }
        ]
      },
    }
    breadCrumbStore.getters = {
      getBreadCrumbs: () => {
        return["D", "E"]
      },
    }
    nodeListStore.getters = {
      getNodeList: () => {
        return[
          {
            resourceNodeList: ["R3", "R4"],
            subjectNodeList: ["S3", "S4"],
            domainNodeList: ["D3", "D4"]
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
      resetAllSubjects: jest.fn(),
      fetchTerms: jest.fn()
    }
    store = new Vuex.Store({
      modules: {
        namespaced: true,
        state,
        actions,
        browseSubjectsStore: browseSubjectsStore,
        addOnFilterSelectedStore: addOnFilterSelectedStore,
        breadCrumbStore: breadCrumbStore,
        nodeListStore: nodeListStore,
        recordTypeStore: recordTypeStore,
      }
    })

    wrapper = shallowMount(SubjectType, {
      localVue,
      vuetify,
      store,
      mocks: {recordArray},
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SubjectType");
  });

});
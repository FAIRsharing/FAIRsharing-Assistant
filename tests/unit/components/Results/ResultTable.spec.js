import {shallowMount} from "@vue/test-utils";
import { createStore } from 'vuex';
import { createVuetify } from 'vuetify'
import {describe, expect, it, beforeEach, afterAll, vi, afterEach} from 'vitest'
import ResultTable from "@/components/Results/ResultTable.vue";
import multiTagsStore from "@/store/multiTagsStore";
import sinon from "sinon";
import GraphClient from "@/lib/GraphClient/GraphClient";

const vuetify = createVuetify();
let mockRoute = {
  path: "/test",
  name: "HomeView",
  params:{
    id: 1
  },
  query:{
    registry: "somestring",
    record_type: "42",
  }
};
let foundPoliciesArr = [
  {
    id:1,
    name: 'name',
    abbreviation: 'abbreviation'
  }
]
multiTagsStore.getters = {
  getFairSharingRecords: () => {
    return [
      {
        record: "Wibble",
        registry: "Standard",
        id: 123,
        name:'mock_record',
        abbreviation: "mock_abbreviation",
        organisationLinks: [{
          relation: 'mock_relation',
          organisation: {
            id: 1,
            name: "mock_organisation_name"
          }
        }
        ]
      }
    ]
  },
  getCurrentRegistry: () => { return "database" }
}

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  }
})

describe("ResultTable.vue", function(){
  let wrapper, graphStub;
  graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
  global.window.URL.createObjectURL = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });


  afterAll(() => {
    graphStub.restore();
  })

  beforeEach(() => {
    wrapper = shallowMount(ResultTable, {
      global:{
        plugins: [vuetify, store],
        mocks: {
          $route: mockRoute,
        },
        stubs: ['router-link', 'router-view']
      },
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ResultTable");
    expect(wrapper.vm.currentRouteQuery).toBe(wrapper.vm.$route.query);
  });

  it("can check sortData computed property when sortBy is by 'Name'", () => {
    //When sortDesc is true
    wrapper.vm.sortBy = "Name"
    wrapper.vm.sortDesc = true
    let outputDesc = [{
      key: 'name',
      order: 'desc'
    }]
    expect(wrapper.vm.sortData).toStrictEqual(outputDesc);

    //When sortDesc is false
    wrapper.vm.sortDesc = false
    let outputAsc = [{
      key: 'name',
      order: 'asc'
    }]
    expect(wrapper.vm.sortData).toStrictEqual(outputAsc);
  });

  it("can check sortData computed property when sortBy is by 'Registry'", () => {
    //When sortDesc is true
    wrapper.vm.sortBy = "Registry"
    wrapper.vm.sortDesc = true
    let outputDesc = [{
      key: 'registry',
      order: 'desc'
    }]
    expect(wrapper.vm.sortData).toStrictEqual(outputDesc);

    //When sortDesc is false
    wrapper.vm.sortBy = "Registry"
    wrapper.vm.sortDesc = false
    let outputAsc = [{
      key: 'registry',
      order: 'asc'
    }]
    expect(wrapper.vm.sortData).toStrictEqual(outputAsc);
  });

  it("can check sortData computed property when sortBy is by 'Type'", () => {
    //When sortDesc is true
    wrapper.vm.sortBy = "Type"
    wrapper.vm.sortDesc = true
    let outputDesc = [{
      key: 'type',
      order: 'desc'
    }]
    expect(wrapper.vm.sortData).toStrictEqual(outputDesc);

    //When sortDesc is false
    wrapper.vm.sortDesc = false
    let outputAsc = [{
      key: 'type',
      order: 'asc'
    }]
    expect(wrapper.vm.sortData).toStrictEqual(outputAsc);
  });

  it("can check sortData computed property when sortBy is by 'Status'", () => {
    //When sortDesc is true
    wrapper.vm.sortBy = "Status"
    wrapper.vm.sortDesc = true
    let outputDesc = [{
      key: 'status',
      order: 'desc'
    }]
    expect(wrapper.vm.sortData).toStrictEqual(outputDesc);

    //When sortDesc is false
    wrapper.vm.sortDesc = false
    let outputAsc = [{
      key: 'status',
      order: 'asc'
    }]
    expect(wrapper.vm.sortData).toStrictEqual(outputAsc);
  });

  it("can check sortData computed property when sortBy is by 'Description'", () => {
    //When sortDesc is true
    wrapper.vm.sortBy = "Description"
    wrapper.vm.sortDesc = true
    let outputDesc = [{
      key: 'description',
      order: 'desc'
    }]
    expect(wrapper.vm.sortData).toStrictEqual(outputDesc);

    //When sortDesc is false
    wrapper.vm.sortDesc = false
    let outputAsc = [{
      key: 'description',
      order: 'asc'
    }]
    expect(wrapper.vm.sortData).toStrictEqual(outputAsc);
  });

  it("can check sortData computed property when sortBy is default", () => {
    //When sortDesc is true
    wrapper.vm.sortBy = ""
    wrapper.vm.sortDesc = true
    let outputDesc = [{
      key: 'name',
      order: 'desc'
    }]
    expect(wrapper.vm.sortData).toStrictEqual(outputDesc);

    //When sortDesc is false
    wrapper.vm.sortDesc = false
    let outputAsc = [{
      key: 'name',
      order: 'asc'
    }]
    expect(wrapper.vm.sortData).toStrictEqual(outputAsc);
  });

  it("can check getData method when getFairSharingRecords is not present", async() => {

    graphStub.returns({
      error: false,
      multiTagFilter: foundPoliciesArr
    });
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return []
      },
      getCurrentRegistry: () => { return "database" }
    }
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      }
    })
    wrapper = shallowMount(ResultTable, {
      global:{
        plugins: [vuetify, store],
        mocks: {
          $route: mockRoute,
        },
        stubs: ['router-link', 'router-view']
      },
    })
    wrapper.vm.records = []
    wrapper.vm.getData()
    expect(wrapper.vm.getData()).toHaveBeenCalled;
  });

  it("can check getData method when 'MULTI_TAGS' response is not error", async() => {
    graphStub.returns({
      error: false,
      multiTagFilter: foundPoliciesArr
    });
    wrapper.vm.getData()
    expect(wrapper.vm.records).toStrictEqual(wrapper.vm.getFairSharingRecords);
  });

  it("can check getData method when 'MULTI_TAGS' response is error", async() => {
    graphStub.returns({
      error: true,
    });
    wrapper.vm.error = true
    wrapper.vm.getData()
    expect(wrapper.vm.error).toBe(true);
  });

  it("can check chooseDownload method", () => {
    wrapper.vm.chooseDownload()
    expect(wrapper.vm.chooseDownloadActive).toBe(true);
  });

  it("can check commenceDownload method", async() => {
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return [
          {
            record: "Wibble",
            registry: "Standard",
            id: 123,
            name:'mock_record',
            organisationLinks: [{
              relation: 'mock_relation',
              organisation: {
                id: 1,
                name: "mock_organisation_name"
              }
            }
            ]
          }
        ]
      },
      getCurrentRegistry: () => { return "database" }
    }
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      }
    })
    wrapper = shallowMount(ResultTable, {
      global:{
        plugins: [vuetify, store],
        mocks: {
          $route: mockRoute,
        },
        stubs: ['router-link', 'router-view']
      },
    })
    delete window.location;
    window.location = { reload: vi.fn() }

    //When argument is true
    await wrapper.vm.commenceDownload(true)
    expect(wrapper.vm.commenceDownload(true)).toHaveBeenCalled;

    //When argument is false
    await wrapper.vm.commenceDownload(false)
    expect(wrapper.vm.commenceDownload(false)).toHaveBeenCalled;
  });


});

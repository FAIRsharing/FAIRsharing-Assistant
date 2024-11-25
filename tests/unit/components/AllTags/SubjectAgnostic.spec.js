import {shallowMount} from "@vue/test-utils";
import { createStore } from 'vuex';
import { createVuetify } from 'vuetify'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import SubjectAgnostic from "@/components/AllTags/SubjectAgnostic";
import multiTagsStore from "@/store/multiTagsStore";

const vuetify = createVuetify();

multiTagsStore.getters = {
  getFairSharingRecords: () => {
    return [
      {
        record: "Wibble",
        registry: "Standard",
        id: 123,
      }
    ]
  },
  getQueryParams:  () => {
    return {
      subjects: ['genetics'],
      registry: ['standard']
    }
  },
  getCurrentRegistry: () => {
    return "standard"
  }
}

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  },
})

describe("SubjectAgnostic.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SubjectAgnostic, {
      global:{
        props :{
          searchTagsRef: {}
        },
        plugins: [vuetify, store],
        stubs: ['router-link', 'router-view']
      },
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SubjectAgnostic");
  });

  it("can check showAgnosticModal computed property", () => {
    //When noThanksSelected data is true
    wrapper.vm.noThanksSelected = true
    expect(wrapper.vm.showAgnosticModal).toBe(false);

    //When noThanksSelected data is false & getCurrentRegistry has a string value
    wrapper.vm.noThanksSelected = false
    expect(wrapper.vm.showAgnosticModal).toBe(true);
  });

  it("can check showAgnosticModal computed property when getFairSharingRecords has more than 2 registries and getCurrentRegistry getter", () => {
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return [
          {
            record: "Wibble1",
            registry: "Standard",
            id: 1,
          },
          {
            record: "Wibble2",
            registry: "Standard",
            id: 2,
          },
          {
            record: "Wibble3",
            registry: "Standard",
            id: 3,
          }
        ]
      },
      getCurrentRegistry: () => {
        return "Standard"
      }
    }
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      },
    })
    wrapper = shallowMount(SubjectAgnostic, {
      global:{
        props :{
          searchTagsRef: {}
        },
        plugins: [vuetify, store],
        stubs: ['router-link', 'router-view']
      },
    })

    wrapper.vm.noThanksSelected = false
    expect(wrapper.vm.showAgnosticModal).toBe(false);
  });

  it("can check showAgnosticModal computed property when noThanksSelected is false and getCurrentRegistry getter does not have not have any value", () => {
    //When if condition is true
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return [
          {
            record: "Wibble",
            registry: "Standard",
            id: 123,
          }
        ]
      },
      getQueryParams:  () => {
        return {
          subjects: ['genetics'],
          registry: ['standard']
        }
      },
      getCurrentRegistry: () => {
        return ""
      }
    }
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      },
    })
    wrapper = shallowMount(SubjectAgnostic, {
      global:{
        props :{
          searchTagsRef: {}
        },
        plugins: [vuetify, store],
        stubs: ['router-link', 'router-view']
      },
    })
    wrapper.vm.noThanksSelected = false

    expect(wrapper.vm.showAgnosticModal).toBe(true);

    //When if condition is false
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return [
          {
            record: "Wibble",
            registry: "Standard",
            id: 123,
          }
        ]
      },
      getQueryParams:  () => {
        return {}
      },
      getCurrentRegistry: () => {
        return ""
      }
    }
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      },
    })
    wrapper = shallowMount(SubjectAgnostic, {
      global:{
        props :{
          searchTagsRef: {}
        },
        plugins: [vuetify, store],
        stubs: ['router-link', 'router-view']
      },
    })
    wrapper.vm.noThanksSelected = false

    expect(wrapper.vm.showAgnosticModal).toBe(false);
  });

  it("can check noThanks method", () => {
    wrapper.vm.noThanks()
    expect(wrapper.vm.noThanksSelected).toBe(true);
  });

  it("can check subjectBrowserLink method", () => {
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return [
          {
            record: "Wibble",
            registry: "Standard",
            id: 123,
          }
        ]
      },
      getQueryParams:  () => {
        return {
          subjects: ['genetics'],
          registry: ['standard']
        }
      },
      getCurrentRegistry: () => {
        return "standard"
      }
    }
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      }
    })

    wrapper = shallowMount(SubjectAgnostic, {
      global:{
        props :{
          searchTagsRef: {}
        },
        plugins: [vuetify, store],
        stubs: ['router-link', 'router-view']
      },
    })
    process.env.VUE_APP_FAIRSHARING_URL = "http://test.com/"
    wrapper.vm.subjectBrowserLink()

    //When getQueryParams has subjects object
    let defaultURL = "http://test.com/browse/subject?term=genetics"
    expect(wrapper.vm.subjectBrowserLink()).toBe(defaultURL);

    //When getQueryParams has no subjects object
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return [
          {
            record: "Wibble",
            registry: "Standard",
            id: 123,
          }
        ]
      },
      getQueryParams:  () => {
        return {
          registry: ['standard']
        }
      },
      getCurrentRegistry: () => {
        return "standard"
      }
    }
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      }
    })

    wrapper = shallowMount(SubjectAgnostic, {
      global:{
        props :{
          searchTagsRef: {}
        },
        plugins: [vuetify, store],
        stubs: ['router-link', 'router-view']
      },
    })

    wrapper.vm.subjectBrowserLink()
    expect(wrapper.vm.subjectBrowserLink()).toBe("http://test.com/browse/subject");

  });

});

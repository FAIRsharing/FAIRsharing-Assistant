import {shallowMount} from "@vue/test-utils";
import { createStore } from 'vuex';
import { createVuetify } from 'vuetify'
import { describe, expect, it, beforeEach } from 'vitest'
import TagsCard from "@/components/AllTags/TagsCard"
import icons from "@/plugins/icons";
import multiTagsStore from "@/store/multiTagsStore";

const vuetify = createVuetify({'icons':icons});

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
  getCurrentRegistry: () => {
    return "Database"
  }
}

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  }
})

describe("TagsCard.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TagsCard, {
      global:{
        plugins: [vuetify, store],
        stubs: ['router-link', 'router-view']
      },
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("TagsCard");
  });

  it("can check recordsCount computed property when there is no getFairSharingRecords", () => {
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return []
      },
      getCurrentRegistry: () => {
        return "Database"
      }
    }

    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      }
    })

    wrapper = shallowMount(TagsCard, {
      global:{
        plugins: [vuetify, store],
        stubs: ['router-link', 'router-view']
      },
    })
    expect(wrapper.vm.recordsCount).toBe(0);
  });

  it("can check registrySelected method", () => {
    wrapper.vm.registrySelected("Database")
    expect(wrapper.vm.registrySelected("Database")).toBe(true);
  });

});

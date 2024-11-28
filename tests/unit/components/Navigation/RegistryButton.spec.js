import {shallowMount} from "@vue/test-utils";
import { createStore } from 'vuex';
import { createVuetify } from 'vuetify'
import {describe, expect, it, beforeEach, vi} from 'vitest'
import RegistryButton from "@/components/Navigation/RegistryButton.vue"
import multiTagsStore from "@/store/multiTagsStore";

const vuetify = createVuetify();
const mockRouter = { push: vi.fn() };
let mockRoute = {
  path: "/refineregistry"
}
multiTagsStore.getters = {
  getRefinedStatus: () => { return true },
}

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  },
})

describe("RegistryButton.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RegistryButton, {
      global:{
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        },
        stubs: ['router-link']
      },
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RegistryButton");
  });

  it("can check registryButtonActive computed property ", () => {
    multiTagsStore.getters = {
      getRefinedStatus: () => { return false },
    }

    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      },
    })
    wrapper = shallowMount(RegistryButton, {
      global:{
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        },
        stubs: ['router-link']
      },
    })
    expect(wrapper.vm.registryButtonActive).toBe(false);
  });

  it("can check returnToRegistries method", () => {
    const returnToRegistries = wrapper.get("[data-testid='returnToRegistries']");
    returnToRegistries.trigger('click')
    wrapper.vm.returnToRegistries()
    expect(wrapper.vm.$route.path).toBe('/refineregistry');
  });

});
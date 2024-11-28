import {shallowMount} from "@vue/test-utils";
import { createStore } from 'vuex';
import { createVuetify } from 'vuetify'
import {describe, expect, it, beforeEach, vi} from 'vitest'
import NavigateBack from "@/components/Navigation/NavigateBackButton"
import navigationStore from "@/store/navigationStore";

const vuetify = createVuetify();

const mockRouter = { push: vi.fn() };
let mockRoute = {
  path: '/1'
};

navigationStore.getters = {
  getPreviousLocation() {
    return '/0'
  }
}
navigationStore.commit = vi.fn()

let store = createStore({
  modules: {
    navigationStore: navigationStore
  }
})

describe("NavigateBack.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(NavigateBack, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        },
        stubs: ['router-link', 'router-view']
      }
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("NavigateBack");
  });

  it("can check navigateToPrevious method", () => {
    const navigateToPrevious = wrapper.get("[data-testid='navigateToPrevious']");
    navigateToPrevious.trigger('click')
    wrapper.vm.navigateToPrevious(wrapper.vm.$route.path)
    expect(wrapper.vm.$route.path).toBe('/1');
  });

});

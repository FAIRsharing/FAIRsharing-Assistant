import {shallowMount} from "@vue/test-utils";
import { createStore } from 'vuex'
import SplashScreen from "@/views/Home/SplashScreen.vue"
import multiTagsStore from "@/store/multiTagsStore";
import { createVuetify } from 'vuetify'
import { describe, expect, it, beforeEach, vi } from 'vitest'


const vuetify = createVuetify();

let actions = {
  resetMultiTags: vi.fn()
}

let store = createStore({
  modules: {
    actions,
    multiTagsStore: multiTagsStore
  },
})


describe("SplashScreen.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SplashScreen, {
      global: {
        plugins: [vuetify, store],
        stubs: ['router-link', 'router-view'],
      },
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SplashScreen");
  });

});
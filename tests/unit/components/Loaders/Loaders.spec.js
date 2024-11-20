import {shallowMount} from "@vue/test-utils";
import { createVuetify } from 'vuetify'
import { describe, expect, it, beforeEach } from 'vitest'
import Loaders from "@/components/Loaders/Loaders"

const vuetify = createVuetify();

describe("Loaders.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Loaders, {
      global: {
        plugins: [vuetify],
        stubs: ['router-link', 'router-view']
      }
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Loaders");
  });

});

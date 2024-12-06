import {shallowMount} from "@vue/test-utils";
import { createVuetify } from 'vuetify'
import { describe, expect, it, beforeEach } from 'vitest'
import RefineFromQuestions from "@/views/Refinements/RefineFromQuestions.vue";


const vuetify = createVuetify();

describe("RefineSelection.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RefineFromQuestions, {
      global: {
        plugins: [vuetify],
        stubs: ['router-link', 'router-view'],
      }
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RefineFromQuestions");
  });

});

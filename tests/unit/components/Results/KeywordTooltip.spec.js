import {shallowMount} from "@vue/test-utils";
// import { createVuetify } from 'vuetify'
import { describe, expect, it } from 'vitest'
import KeywordTooltip from "@/components/Results/KeywordTooltip.vue"

// const vuetify = createVuetify();

describe('KeywordTooltip.vue', () => {
  let wrapper;
  let keyword = {
    label: 'ABC',
    synonyms: ["abc", "def:test"],
    definitions: ["first def"],
    expandedNames: []
  };

  it("can be mounted", () => {
    wrapper = shallowMount(KeywordTooltip, { props: { keyword: keyword } });
    expect(wrapper.vm.$options.name).toMatch("KeywordTooltip");
    expect(wrapper.vm.processArray(wrapper.vm.keyword.synonyms)).toBe("abc, def: test.")
  });

  it ("can process empty synonyms", () => {
    keyword.synonyms = [];
    wrapper = shallowMount(KeywordTooltip, { propsData: { keyword: keyword  } });
    expect(wrapper.vm.processArray(wrapper.vm.keyword.synonyms)).toBe(null);
  })

  it ("can process without definitions in keyword object", () => {
    keyword = {
      label: 'abc',
    };
    wrapper = shallowMount(KeywordTooltip, { propsData: { keyword: keyword  } });
    expect(wrapper.vm.capitaliseText(wrapper.vm.keyword['label'], 'taxonomy')).toBe("Abc");
  })

});

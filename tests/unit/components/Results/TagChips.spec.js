import {shallowMount} from "@vue/test-utils";
import { createVuetify } from 'vuetify'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import TagChips from "@/components/Results/TagChips.vue"

const vuetify = createVuetify();

let $route = {
  name: "search",
  query: {}
};

const $router = {
  push: vi.fn(),
};

describe("TagChips.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TagChips, {
      global:{
        plugins: [vuetify],
        mocks: {$route, $router}
      },
      props: {
        record: {
          name: 'test record',
          subjects: [
            {
              label: 'first chip',
              active: false
            }
          ],
          domains: [
            {
              label: 'second chip',
              active: false
            }
          ],
          taxonomies: [
            {
              label: 'third chip',
              active: false
            },
            {
              label: 'fourth chip',
              active: false
            },
            {
              label: 'fifth chip',
              active: false
            },
            {
              label: 'sixth chip',
              active: false
            },
            {
              label: 'seventh chip',
              active: false
            },
            {
              label: 'eighth chip',
              active: false
            },
            {
              label: 'ninth chip',
              active: false
            }
          ],
          user_defined_tags: [
            {
              label: 'a tag'
            }
          ]
        }
        /*
        type: 'domains',
        chips: [
          {
            label: 'first chip',
            active: false
          }
        ]
         */
      },

    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("TagChips");
  });

  it("getChipColor", () => {
    let chip = {type: 'subjects'};
    expect(wrapper.vm.getChipColor(chip)).toEqual('subject_color');
    chip = {type: 'domains'};
    expect(wrapper.vm.getChipColor(chip)).toEqual('domain_color');
    chip = {type: 'taxonomies'};
    expect(wrapper.vm.getChipColor(chip)).toEqual('taxonomic_color');
    chip = {type: 'userDefinedTags'};
    expect(wrapper.vm.getChipColor(chip)).toEqual('tags_color');
  });

  it("capitalises words properly", () => {
    expect(wrapper.vm.capitaliseText('this that', 'taxonomy')).toEqual('This that');
    expect(wrapper.vm.capitaliseText('this that', 'other')).toEqual('This That');
  });

});

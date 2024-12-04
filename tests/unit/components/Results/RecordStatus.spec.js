import {shallowMount} from "@vue/test-utils";
import { createVuetify } from 'vuetify'
import {beforeEach, describe, expect, it} from 'vitest'
import RecordStatus from "@/components/Results/RecordStatus.vue"
import fairSharingTheme from '@/plugins/theme'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'fairSharingTheme',
    themes: {fairSharingTheme}
  }
});

describe("RecordStatus.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RecordStatus, {
      global:{
        data() {
          return {
            recordType:{
              record:{
                type: 'icon'
              }
            }
          }
        },
        props: {
          record: {},
          showStatus: true,
          showOnlyStatus: false,
          inEditForm: false
        },
        plugins: [vuetify],
      },

    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RecordStatus");
  });

  it("can be instantiated when showStatus is false", async () => {
    await wrapper.setProps({
      showStatus: false,
    })
    expect(wrapper.vm.$options.name).toMatch("RecordStatus");
  });

  it("can be instantiated when inEditForm and showOnlyStatus are true", async () => {
    await wrapper.setProps({
      showOnlyStatus: true,
      inEditForm: true
    })
    expect(wrapper.vm.$options.name).toMatch("RecordStatus");
  });

  it("can check getRecordStatus computed property when statusStyles is not undefined", async () => {
    await wrapper.setProps({
      record: {
        status: 'ready',
        type: 'collection'
      },
      showOnlyStatus: true,
    })

    wrapper.vm.statusStyles.ready = {
      title: 'R',
      tooltip: 'Ready',
      backColor: 'green'
    }

    let resultStyle = {
      title: 'R',
      tooltip: 'Ready',
      backColor: 'green'
    }

    expect(wrapper.vm.getRecordStatus).toStrictEqual(resultStyle);
  });

  it("can check getRecordStatus computed property when statusStyles & record has status undefined", async () => {
    await wrapper.setProps({
      record: {
        status: undefined,
        type: 'collection'
      },
    })

    wrapper.vm.statusStyles.undefined = {
      title: '?',
      tooltip: 'Undefined',
      backColor: 'background: linear-gradient(red, red)'
    }

    let resultStyle = {
      title: '?',
      tooltip: 'Undefined',
      backColor: 'background: linear-gradient(red, red)'
    }

    expect(wrapper.vm.getRecordStatus).toStrictEqual(resultStyle);
  });

});

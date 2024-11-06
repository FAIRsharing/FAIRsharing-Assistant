import {shallowMount} from "@vue/test-utils";
import { createVuetify } from 'vuetify'
import { describe, expect, it} from 'vitest'
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

  it("can be instantiated", () => {
    wrapper = shallowMount(RecordStatus, {
      global:{
        plugins: [vuetify],
      },
      props: {
        record: {},
        showStatus: true,
        showOnlyStatus: false,
        inEditForm: false
      }
    });

    expect(wrapper.vm.$options.name).toMatch("RecordStatus");
  });

  it("can be instantiated when showOnlyStatus is true", () => {
    wrapper = shallowMount(RecordStatus, {
      global:{
        plugins: [vuetify],
      },
      props: {
        record: {},
        showStatus: true,
        showOnlyStatus: true,
        inEditForm: true
      }
    });
    wrapper.vm.recordType = true
    expect(wrapper.vm.$options.name).toMatch("RecordStatus");
  });

  it("can be instantiated when showOnlyStatus, showStatus, inEditForm is false", () => {
    wrapper = shallowMount(RecordStatus, {
      global:{
        plugins: [vuetify],
      },
      props: {
        record: {},
        showStatus: false,
        showOnlyStatus: false,
        inEditForm: false
      }
    });
    wrapper.vm.recordType = true
    expect(wrapper.vm.$options.name).toMatch("RecordStatus");
  });

  it("can check getRecordStatus computed property when statusStyles is not undefined", () => {
    wrapper = shallowMount(RecordStatus, {
      global:{
        plugins: [vuetify],
      },
      props: {
        record: {
          status: 'ready',
          type: 'collection'
        },
        showStatus: true,
        showOnlyStatus: true,
        inEditForm: false
      }
    });

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

  it("can check getRecordStatus computed property when statusStyles & record has status undefined", () => {
    wrapper = shallowMount(RecordStatus, {
      global:{
        plugins: [vuetify],
      },
      props: {
        record: {
          status: undefined,
          type: 'collection'
        },
        showStatus: true,
        showOnlyStatus: true,
        inEditForm: false
      }
    });

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

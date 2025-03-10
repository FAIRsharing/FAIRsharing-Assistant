import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach } from "vitest";
import ResourceCard from "@/components/Others/ResourceCard.vue";
import icons from "@/plugins/icons";

const vuetify = createVuetify({ icons: icons });

describe("ResourceCard.vue", function () {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(ResourceCard, {
      global: {
        props: {
          registry: "",
          registryIcon: "home_standard",
          registrySelected: false,
          registryName: "",
          recordsCount: 0,
          showRefineButton: false,
        },
        plugins: [vuetify],
        stubs: ["router-link", "router-view"],
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ResourceCard");
  });
});

import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach } from "vitest";
import Jumbotron from "@/components/Navigation/Jumbotron";
import VueParticles from "@tsparticles/vue3";

const vuetify = createVuetify();
let $route = { path: "/", name: "HomeView" };

describe("Jumbotron.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Jumbotron, {
      global: {
        components: {
          "vue-particles": VueParticles,
        },
        plugins: [vuetify],
        mocks: {
          $route: $route,
        },
        stubs: ["router-link", "router-view"],
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Jumbotron");
  });

  it("can check if getJumbotronData has subTitle text", () => {
    const subTitle = wrapper.get("[data-testid='subTitle']");
    expect(subTitle.text()).toEqual("Please answer the questions below...");
  });

  it("can check getJumbotronData does not has subTitle text (ELSE condition)", () => {
    wrapper.vm.getJumbotronData["subTitle"] = "";
    expect(wrapper.find("#subTitle").exists()).toBe(false);
  });

  it("can check addClass method", () => {
    wrapper.vm.getJumbotronData["pageName"] = "HomeView";
    expect(wrapper.vm.addClass()).toBe("heroBlock");
  });
});

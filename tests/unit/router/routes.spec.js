import {shallowMount} from "@vue/test-utils";
import { createWebHistory, createRouter } from "vue-router";
import {describe, expect, it} from 'vitest'
import Licence from "@/views/Licence/Licence.vue";
import App from "@/App.vue";

describe("Routes", () =>{

  it("renders a HomeView component via routing", async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{
        name: "Licence",
        path: "/licence",
        component: Licence,
      }]
    })
    await router.push("/licence")
    await router.isReady()
    const wrapper = shallowMount(App, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.findComponent(App).exists()).toBe(true)
  });
});

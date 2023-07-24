import {shallowMount, createLocalVue} from "@vue/test-utils";
import routes from "@/router/index"
import VueRouter from "vue-router";
import App from "@/App.vue";

const localVue = createLocalVue()
localVue.use(VueRouter)


describe("Routes", () =>{
  const testRoute = routes.options.routes.filter(({name}) => name === "HomeView")

  it("renders a HomeView component via routing", async () => {
    const router = new VueRouter({ mode: 'history', testRoute })
    const wrapper = shallowMount(App, {
      localVue,
      router
    })
    router.push("/1")
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(App).exists()).toBe(true)

  });
});

import breadCrumbStore from "@/store/breadCrumbStore.js"


describe('breadCrumbStore store methods', () => {
  const {actions, mutations, getters } = breadCrumbStore

  let state = {};

  beforeEach(() => {
    state = {
      breadCrumbs: []
    };
  });

  actions.commit = jest.fn();

  it("can check resetbreadCrumbs actions", () => {
    const commit = jest.fn()
    actions.resetbreadCrumbs({ commit })
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check displayBreadCrumbs mutations", () => {
    const returnedVal = ["A", "B"]
    mutations.displayBreadCrumbs(state, returnedVal);
    expect(state.breadCrumbs).toBe(returnedVal);
  });

  it("can check resetbreadCrumbs mutations", () => {
    const returnedVal = []
    mutations.resetbreadCrumbs(state);
    expect(state.breadCrumbs).toStrictEqual(returnedVal);
  });

  it("can check getBreadCrumbs getters for breadcrumbs", () => {
    const returnedVal = {
      breadCrumbs:["A", "B"]
    }
    const builtData = getters.getBreadCrumbs(returnedVal);
    expect(builtData).toStrictEqual(["A", "B"]);
  });

  it("can check getBreadCrumbs getters no breadcrumbs", () => {
    const builtData = getters.getBreadCrumbs(state);
    expect(builtData).toBe(null);
  });

})
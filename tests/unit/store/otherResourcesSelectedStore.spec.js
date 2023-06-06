import otherResourcesSelectedStore  from "@/store/otherResourcesSelectedStore.js"


describe('breadCrumbStore store methods', () => {
  const {actions, mutations, getters} = otherResourcesSelectedStore
  let state = {};

  beforeEach(() => {
    state = {
      otherResourceType: []
    };
  });

  actions.commit = jest.fn();

  it("can check resetOtherResourceSelected actions", () => {
    const commit = jest.fn()
    actions.resetOtherResourceSelected({ commit })
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check otherResourceSelected mutations", () => {
    const returnedVal = ["A", "B"]
    mutations.otherResourceSelected(state, returnedVal);
    expect(state.otherResourceType).toBe(returnedVal);
  });

  it("can check resetOtherResourceSelected mutations", () => {
    const returnedVal = []
    mutations.resetOtherResourceSelected(state, returnedVal);
    expect(state.otherResourceType).toStrictEqual([]);
  });

  it("can check getOtherResourceSelected getters", () => {
    const returnedVal = {
      otherResourceType:["A", "B"]
    }
    const builtData = getters.getOtherResourceSelected(returnedVal);
    expect(builtData).toStrictEqual(["A", "B"]);
  });

})
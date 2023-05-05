import otherResourcesSelectedStore  from "@/store/otherResourcesSelectedStore.js"


describe('breadCrumbStore store methods', () => {
  const {mutations, getters} = otherResourcesSelectedStore
  let state = {};

  beforeEach(() => {
    state = {
      otherResourceType: []
    };
  });

  it("can check otherResourceSelected mutations", () => {
    const returnedVal = ["A", "B"]
    mutations.otherResourceSelected(state, returnedVal);
    expect(state.otherResourceType).toBe(returnedVal);
  });

  it("can check getOtherResourceSelected getters", () => {
    const returnedVal = {
      otherResourceType:["A", "B"]
    }
    const builtData = getters.getOtherResourceSelected(returnedVal);
    expect(builtData).toStrictEqual(["A", "B"]);
  });

})
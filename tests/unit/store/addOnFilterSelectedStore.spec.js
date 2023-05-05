import addOnFilterSelectedStore  from "@/store/addOnFilterSelectedStore.js"


describe('breadCrumbStore store methods', () => {
  const {mutations, getters} = addOnFilterSelectedStore
  let state = {};

  beforeEach(() => {
    state = {
      filtersType: []
    };
  });

  it("can check filtersSelected mutations", () => {
    const returnedVal = ["A", "B"]
    mutations.filtersSelected(state, returnedVal);
    expect(state.filtersType).toBe(returnedVal);
  });

  it("can check getFilters getters", () => {
    const returnedVal = {
      filtersType:["A", "B"]
    }
    const builtData = getters.getFilters(returnedVal);
    expect(builtData).toStrictEqual(["A", "B"]);
  });

})
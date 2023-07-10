import addOnFilterSelectedStore  from "@/store/addOnFilterSelectedStore.js"


describe('breadCrumbStore store methods', () => {
  const {actions, mutations, getters} = addOnFilterSelectedStore
  let state = {};

  beforeEach(() => {
    state = {
      filtersType: []
    };
  });

  actions.commit = jest.fn();

  it("can check resetFiltersSelected actions", () => {
    const commit = jest.fn()
    actions.resetFiltersSelected({ commit })
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check filtersSelected mutations", () => {
    const returnedVal = {"A": "B"}
    mutations.filtersSelected(state, returnedVal);
    console.log(JSON.stringify(state.filtersType));
    expect(state.filtersType).toStrictEqual([returnedVal]);
  });

  it("can check resetFiltersSelected mutations", () => {
    const returnedVal = []
    mutations.resetFiltersSelected(state, returnedVal);
    expect(state.filtersType).toStrictEqual([]);
  });

  it("can check getFilters getters", () => {
    const returnedVal = {
      filtersType:["A", "B"]
    }
    const builtData = getters.getFilters(returnedVal);
    expect(builtData).toStrictEqual(["A", "B"]);
  });

})
import navigationStore from "@/store/navigationStore";

describe('Navigation store methods', () => {
  const {mutations, getters} = navigationStore
  let state = {
    previousLocation: '/1'
  };

  it("can run setNavigationState mutation", () => {
    mutations.setNavigationState(state, '/2');
    expect(state.previousLocation).toBe('/2');
  });

  it("can get previous location", () => {
    expect(getters.getPreviousLocation(state)).toEqual('/2');
  });

})
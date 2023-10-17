import navigationStore from "@/store/navigationStore";

describe('Navigation store methods', () => {
  const { mutations, getters} = navigationStore
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

  it("can set compliance", () => {
    mutations.setComplianceState(state, 'Genbank Sequence Format');
    expect(state.compliantWith).toBe('Genbank Sequence Format');
  });

  it("can get compliance", () => {
    expect(getters.getCompliantWith(state)).toEqual('Genbank Sequence Format');
  });

  it("can clear navigation state", () => {
    let returnVal = {
      previousLocation: null,
      compliantWith: null
    }
    mutations.clearNavigation(state);
    expect(state).toStrictEqual(returnVal);
  })

})
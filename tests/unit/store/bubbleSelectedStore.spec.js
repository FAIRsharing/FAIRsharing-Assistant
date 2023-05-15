import bubbleSelectedStore  from "@/store/bubbleSelectedStore.js"


describe('bubbleSelectedStore store methods', () => {
  const {actions, mutations, getters} = bubbleSelectedStore
  let state = {};

  beforeEach(() => {
    state = {
      topResourceType: "",
      resourceType: "",
      allResources: [],
      subjectType: "",
      domainType: "",
      subjectList: [],
      nodeList: {},
      domainList: [],
      allSubjects: false
    };
  });

  actions.commit = jest.fn();

  it("can check resetAllSelectedValues actions", () => {
    const commit = jest.fn()
    actions.resetAllSelectedValues({ commit })
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check resourceSelected mutations", () => {
    const returnedVal = {
      topResourceSelected: "Parent",
      childResourceSelected: "Child"
    }
    mutations.resourceSelected(state, returnedVal);
    expect(state.topResourceType).toBe(returnedVal.topResourceSelected);
    expect(state.resourceType).toBe(returnedVal.childResourceSelected);
  });

  it("can check subjectSelected mutations", () => {
    const returnedVal = "Test"
    mutations.subjectSelected(state, {subjectSelected: returnedVal});
    expect(state.subjectType).toBe(returnedVal);
  });

  it("can check domainSelected mutations", () => {
    const returnedVal = "Test"
    mutations.domainSelected(state, {domainSelected: returnedVal});
    expect(state.domainType).toBe(returnedVal);
  });


  it("can check resetAllBubbles mutations", () => {
    const returnedVal = {
      topResourceType: "",
      resourceType: "",
      allResources: [],
      subjectType: "",
      domainType: "",
      subjectList: [],
      nodeList: {},
      domainList: [],
      allSubjects: false
    }
    mutations.resetAllBubbles(state);
    expect(state).toStrictEqual(returnedVal);
  });

  it("can check getTopResource getters", () => {
    const stateValue = {
      topResourceType: "Test"
    }
    const builtData = getters.getTopResource(stateValue);
    expect(builtData).toBe("Test");
  });

  it("can check getResource getters", () => {
    const stateValue = {
      resourceType: "Test"
    }
    const builtData = getters.getResource(stateValue);
    expect(builtData).toBe("Test");
  });

  it("can check getAllResources getters", () => {
    const stateValue = {
      allResources: ["A", "B"]
    }
    const builtData = getters.getAllResources(stateValue);
    expect(builtData).toStrictEqual(["A", "B"]);
  });

  it("can check getSubject getters", () => {
    const stateValue = {
      subjectType: "Test"
    }
    const builtData = getters.getSubject(stateValue);
    expect(builtData).toBe("Test");
  });

  it("can check getDomain getters", () => {
    const stateValue = {
      domainType: "Test"
    }
    const builtData = getters.getDomain(stateValue);
    expect(builtData).toBe("Test");
  });

})
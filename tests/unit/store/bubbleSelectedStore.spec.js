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
      subjectList: [],
      allSubjects: false,
      domainType: "",
      domainList: [],
      nodeSelected: {}
    };
  });

  actions.commit = jest.fn();

  it("can check resetAllSelectedValues actions", () => {
    const commit = jest.fn()
    actions.resetAllSelectedValues({ commit })
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check resetAllSubjects actions", () => {
    const commit = jest.fn()
    actions.resetAllSubjects({ commit })
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

  it("can check resourceSelected mutations when resource parent is true ", () => {
    const returnedVal = {
      topResourceSelected: "Parent",
      childResourceSelected: "Child",
      recordsNumber: 123,
      parent: true,
      child: false
    }
    mutations.resourceSelected(state, returnedVal);
    expect(state.nodeSelected.records).toBe(returnedVal.topResourceSelected);
    expect(state.nodeSelected.recordsNumber).toBe(returnedVal.recordsNumber);
    expect(state.nodeSelected.type).toBe("resourceParent");
  });

  it("can check resourceSelected mutations when resource child is true ", () => {
    const returnedVal = {
      topResourceSelected: "Parent",
      childResourceSelected: "Child",
      recordsNumber: 123,
      parent: false,
      child: true
    }
    mutations.resourceSelected(state, returnedVal);
    expect(state.nodeSelected.records).toBe(returnedVal.childResourceSelected);
    expect(state.nodeSelected.recordsNumber).toBe(returnedVal.recordsNumber);
    expect(state.nodeSelected.type).toBe("resource");
  });

  it("can check subjectSelected mutations", () => {
    const returnedVal = {
      subjectSelected : "Test",
      recordsNumber: 1233
    }
    mutations.subjectSelected(state, returnedVal);
    expect(state.subjectType).toBe(returnedVal.subjectSelected);
    expect(state.nodeSelected.records).toBe(returnedVal.subjectSelected);
    expect(state.nodeSelected.recordsNumber).toBe(returnedVal.recordsNumber);
  });

  // it("can check ELSE for subjectSelected mutations", () => {
  //   const returnedVal = {
  //     subjectSelected : "Test",
  //     recordsNumber: 1233
  //   }
  //
  //   state = {
  //     subjectType: "Test",
  //     subjectList: {
  //       records : "Test",
  //       recordsNumber: 1233
  //     }
  //   }
  //
  //   const found = jest.fn();
  //   jest.spyOn(found, 'call')
  //   mutations.subjectSelected(state, returnedVal);
  //
  //   expect(state.subjectList.records).toBe(state.subjectType);
  //   expect(state.subjectList.recordsNumber).toBe(returnedVal.recordsNumber);
  // });

  it("can check allSubjectsSelected mutations", () => {
    const returnedVal = true
    mutations.allSubjectsSelected(state, returnedVal);
    expect(state.allSubjects).toBe(returnedVal);
  });


  it("can check domainSelected mutations", () => {
    const returnedVal = {
      domainSelected : "Test",
      recordsNumber: 1233
    }
    mutations.domainSelected(state, returnedVal);
    expect(state.domainType).toBe(returnedVal.domainSelected);
    expect(state.nodeSelected.records).toBe(returnedVal.domainSelected);
    expect(state.nodeSelected.recordsNumber).toBe(returnedVal.recordsNumber);
  });

  it("can check resetAllSubjects mutations", () => {
    const returnedVal = {
      allSubjects: false,
    }
    mutations.resetAllSubjects(state);
    expect(state.allSubjects).toStrictEqual(returnedVal.allSubjects);
  });


  it("can check resetAllBubbles mutations", () => {
    const returnedVal = {
      topResourceType: "",
      resourceType: "",
      allResources: [],
      subjectType: "",
      subjectList: [],
      allSubjects: false,
      domainType: "",
      domainList: [],
      nodeSelected: {}
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

  it("can check getSubjectList getters", () => {
    const stateValue = {
      subjectList: ["A", "B"]
    }
    const builtData = getters.getSubjectList(stateValue);
    expect(builtData).toStrictEqual(["A", "B"]);
  });

  it("can check getAllSubjects getters", () => {
    const stateValue = {
      allSubjects: true
    }
    const builtData = getters.getAllSubjects(stateValue);
    expect(builtData).toBe(true);
  });

  it("can check getDomain getters", () => {
    const stateValue = {
      domainType: "Test"
    }
    const builtData = getters.getDomain(stateValue);
    expect(builtData).toBe("Test");
  });

  it("can check getDomainList getters", () => {
    const stateValue = {
      domainList: ["A", "B"]
    }
    const builtData = getters.getDomainList(stateValue);
    expect(builtData).toStrictEqual(["A", "B"]);
  });

  it("can check getNodes getters", () => {
    const stateValue = {
      nodeSelected: {name: "A"}
    }
    const builtData = getters.getNodes(stateValue);
    expect(builtData).toStrictEqual({name: "A"});
  });

})
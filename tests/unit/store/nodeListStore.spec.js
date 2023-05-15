import nodeListStore  from "@/store/nodeListStore.js"


describe('nodeListStore store methods', () => {
  const {mutations, getters, actions} = nodeListStore
  let state = {};

  beforeEach(() => {
    state = {
      nodeList: [],
      nodeFound: false
    };
  });

  it("can check resetNodeLists actions", () => {
    const commit = jest.fn()
    actions.resetNodeLists({ commit })
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check nodeLists mutations when node is not present in nodeList", () => {
    const returnedVal =
      {
        records: "Test",
        recordsNumber: 12
      }

    const returnedArray = [
      returnedVal
    ]

    mutations.nodeLists(state, returnedVal);
    expect(state.nodeList).toStrictEqual(returnedArray);
    expect(state.nodeFound).toBe(false);
  });

  it("can check nodeLists mutations when node is present in nodeList", () => {
    const returnedVal =
        {
          records: "Test",
          recordsNumber: 12
        }

    state.nodeList = [
      returnedVal
    ]

    mutations.nodeLists(state, returnedVal);
    expect(state.nodeFound).toBe(true);
  });

  it("can check deleteNode mutations when node is deleted from nodeList", () => {
    const returnedVal =
        {
          records: "Test",
          recordsNumber: 12
        }

    state.nodeList = []

    mutations.deleteNode(state, returnedVal);
    expect(state.nodeList).toStrictEqual([]);
  });

  it("can check resetNodeLists mutations", () => {
    const returnedVal = []
    mutations.resetNodeLists(state);
    expect(state.nodeList).toStrictEqual(returnedVal);
  });

  it("can check getNodeList getters for nodeList", () => {
    const returnedVal = {
      nodeList:["A", "B"]
    }
    const builtData = getters.getNodeList(returnedVal);
    expect(builtData).toStrictEqual(["A", "B"]);
  });

  it("can check getNodeFound getters for nodeFound", () => {
    const returnedVal = {
      nodeFound: true
    }
    const builtData = getters.getNodeFound(returnedVal);
    expect(builtData).toBe(true);
  });

})
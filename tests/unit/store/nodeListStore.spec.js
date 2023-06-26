import nodeListStore  from "@/store/nodeListStore.js"
describe('nodeListStore store methods', () => {
  const {actions, mutations, getters,
    isNodePresent,
    deleteNode
  } = nodeListStore
  let state = {};

  beforeEach(() => {
    state = {
      nodeList: {
        resourceNodeList: [],
        subjectNodeList: [],
        domainNodeList: []
      },
      nodeFound: {
        isResourceNode: false,
        isSubjectNode: false,
        isDomainNode: false,
      }
    };
  });

  actions.commit = jest.fn();

  it("can check isNodePresent method", () => {
    const recordArray = [
      {
        records:"ABC",
        recordsNumber: 1,
        type: "resourceParent"
      },
      {
        records:"CDE",
        recordsNumber:343,
        type: "resource"
      },
      {
        records:"XYZ",
        recordsNumber:232,
        type: "resource"
      }
    ]
    const nodeItem = {
      records:"CDE",
      recordsNumber:343,
      type: "resource"
    }
    const result = isNodePresent(recordArray, nodeItem);
    expect(result).toStrictEqual(nodeItem);
  });

  it("can check deleteNode method", () => {
    const recordArray = [
      {
        records:"ABC",
        recordsNumber: 1,
        type: "resourceParent"
      },
      {
        records:"CDE",
        recordsNumber:343,
        type: "resource"
      },
      {
        records:"XYZ",
        recordsNumber:232,
        type: "resource"
      }
    ]
    const nodeItem = {
      records:"CDE",
      recordsNumber:343,
      type: "resource"
    }
    const resultArray = [
      {
        records:"XYZ",
        recordsNumber:232,
        type: "resource"
      }
    ]
    const result = deleteNode(recordArray, nodeItem);
    expect(result).toStrictEqual(resultArray);
  });

  it("can check resetNodeLists actions", () => {
    const commit = jest.fn()
    actions.resetNodeLists({ commit })
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check nodeLists mutations for route DatabaseView", () => {
    const nodeItem = {
      records:"CDE",
      recordsNumber:343,
      type: "resource"
    }
    const routeName = "DatabaseView"

    //For if Statement
    const isNodePresentIfMethod = jest.fn().mockReturnValue(true)
    mutations.nodeLists(state, [nodeItem, routeName]);
    isNodePresentIfMethod()
    expect(state.nodeFound.isResourceNode).toBe(false);
    //For else Statement
    const isNodePresentElseMethod = jest.fn().mockReturnValue(false)
    mutations.nodeLists(state, [nodeItem, routeName]);
    isNodePresentElseMethod()
    expect(state.nodeFound.isResourceNode).toBe(true);
  });

  it("can check nodeLists mutations for route StandardsView", () => {
    const nodeItem = {
      records:"CDE",
      recordsNumber:343,
      type: "resource"
    }
    const routeName = "StandardsView"
    //For if Statement
    const isNodePresentIfMethod = jest.fn().mockReturnValue(true)
    mutations.nodeLists(state, [nodeItem, routeName]);
    isNodePresentIfMethod()
    expect(state.nodeFound.isResourceNode).toBe(false);
    //For else Statement
    const isNodePresentElseMethod = jest.fn().mockReturnValue(false)
    mutations.nodeLists(state, [nodeItem, routeName]);
    isNodePresentElseMethod()
    expect(state.nodeFound.isResourceNode).toBe(true);

  });

  it("can check nodeLists mutations for route PoliciesView", () => {
    const nodeItem = {
      records:"CDE",
      recordsNumber:343,
      type: "resource"
    }
    const routeName = "PoliciesView"
    //For if Statement
    const isNodePresentIfMethod = jest.fn().mockReturnValue(true)
    mutations.nodeLists(state, [nodeItem, routeName]);
    isNodePresentIfMethod()
    expect(state.nodeFound.isResourceNode).toBe(false);
    //For else Statement
    const isNodePresentElseMethod = jest.fn().mockReturnValue(false)
    mutations.nodeLists(state, [nodeItem, routeName]);
    isNodePresentElseMethod()
    expect(state.nodeFound.isResourceNode).toBe(true)
  });

  it("can check nodeLists mutations for route RefineResourceView", () => {
    const nodeItem = {
      records:"CDE",
      recordsNumber:343,
      type: "resource"
    }
    const routeName = "RefineResourceView"

    mutations.nodeLists(state, [nodeItem, routeName]);
    expect(state.nodeList.resourceNodeList.length).toBe(1);
  });

  it("can check nodeLists mutations for route SubjectTypeView", () => {
    const nodeItem = {
      records:"CDE",
      recordsNumber:343,
      type: "resource"
    }
    const routeName = "SubjectTypeView"
    //For if Statement
    const isNodePresentIfMethod = jest.fn().mockReturnValue(true)
    mutations.nodeLists(state, [nodeItem, routeName]);
    isNodePresentIfMethod()
    expect(state.nodeFound.isSubjectNode).toBe(false);
    //For else Statement
    const isNodePresentElseMethod = jest.fn().mockReturnValue(false)
    mutations.nodeLists(state, [nodeItem, routeName]);
    isNodePresentElseMethod()
    expect(state.nodeFound.isSubjectNode).toBe(true)
  });

  it("can check nodeLists mutations for route DomainTypeView", () => {
    const nodeItem = {
      records:"CDE",
      recordsNumber:343,
      type: "resource"
    }
    const routeName = "DomainTypeView"
    //For if Statement
    const isNodePresentIfMethod = jest.fn().mockReturnValue(true)
    mutations.nodeLists(state, [nodeItem, routeName]);
    isNodePresentIfMethod()
    expect(state.nodeFound.isDomainNode).toBe(false);
    //For else Statement
    const isNodePresentElseMethod = jest.fn().mockReturnValue(false)
    mutations.nodeLists(state, [nodeItem, routeName]);
    isNodePresentElseMethod()
    expect(state.nodeFound.isDomainNode).toBe(true)
  });

  it("can check deleteNode mutations for type Resource", () => {
    state.nodeList.resourceNodeList = [
      {
        records:"XYZ",
        recordsNumber:232,
        type: "resource"
      }
    ]
    state.nodeList.subjectNodeList = [
      {
        records:"ABC",
        recordsNumber: 1,
        type: "subject"
      },
    ]
    const nodeItem = {
      records:"XYZ",
      recordsNumber:232,
      type: "resource"
    }
    const resultArray = [
      {
        records:"ABC",
        recordsNumber: 1,
        type: "subject"
      },
    ]

    const isDeleteNodeMethod = jest.fn().mockReturnValue(nodeItem)
    mutations.deleteNode(state, nodeItem);
    isDeleteNodeMethod()
    expect(state.nodeList.resourceNodeList).toStrictEqual([]);
    expect(state.nodeList.subjectNodeList).toStrictEqual(resultArray);

  });

  it("can check deleteNode mutations for type ResourceParent", () => {
    state.nodeList.resourceNodeList = [
      {
        records:"ABC",
        recordsNumber: 1,
        type: "resourceParent"
      },
    ]
    state.nodeList.subjectNodeList = [
      {
        records:"ABC",
        recordsNumber: 1,
        type: "subject"
      },
    ]
    const nodeItem = {
      records:"ABC",
      recordsNumber: 1,
      type: "resourceParent"
    }
    const resultArray = [
      {
        records:"ABC",
        recordsNumber: 1,
        type: "subject"
      },
    ]

    const isDeleteNodeMethod = jest.fn().mockReturnValue(nodeItem)
    mutations.deleteNode(state, nodeItem);
    isDeleteNodeMethod()
    expect(state.nodeList.resourceNodeList).toStrictEqual([]);
    expect(state.nodeList.subjectNodeList).toStrictEqual(resultArray);
  });

  it("can check deleteNode mutations for type Subject", () => {
    state.nodeList.resourceNodeList = [
      {
        records:"ABC",
        recordsNumber: 1,
        type: "resourceParent"
      },
      {
        records:"CDE",
        recordsNumber:343,
        type: "resource"
      },
      {
        records:"XYZ",
        recordsNumber:232,
        type: "resource"
      }
    ]
    state.nodeList.subjectNodeList = [
      {
        records:"ABC",
        recordsNumber: 1,
        type: "subject"
      },
    ]
    const nodeItem = {
      records:"ABC",
      recordsNumber: 1,
      type: "subject"
    }
    const resultArray = [
      {
        records:"ABC",
        recordsNumber: 1,
        type: "resourceParent"
      },
      {
        records:"CDE",
        recordsNumber:343,
        type: "resource"
      },
      {
        records:"XYZ",
        recordsNumber:232,
        type: "resource"
      }
    ]

    const isDeleteNodeMethod = jest.fn().mockReturnValue(nodeItem)
    mutations.deleteNode(state, nodeItem);
    isDeleteNodeMethod()
    expect(state.nodeList.subjectNodeList).toStrictEqual([]);
    expect(state.nodeList.resourceNodeList).toStrictEqual(resultArray);
  });

  it("can check deleteNode mutations for type Domain", () => {
    state.nodeList.resourceNodeList = [
      {
        records:"ABC",
        recordsNumber: 1,
        type: "resourceParent"
      },
      {
        records:"CDE",
        recordsNumber:343,
        type: "resource"
      },
      {
        records:"XYZ",
        recordsNumber:232,
        type: "resource"
      }
    ]
    state.nodeList.domainNodeList = [
      {
        records:"ABC",
        recordsNumber: 1,
        type: "domain"
      },
    ]
    const nodeItem = {
      records:"ABC",
      recordsNumber: 1,
      type: "domain"
    }
    const resultArray = [
      {
        records:"ABC",
        recordsNumber: 1,
        type: "resourceParent"
      },
      {
        records:"CDE",
        recordsNumber:343,
        type: "resource"
      },
      {
        records:"XYZ",
        recordsNumber:232,
        type: "resource"
      }
    ]

    const isDeleteNodeMethod = jest.fn().mockReturnValue(nodeItem)
    mutations.deleteNode(state, nodeItem);
    isDeleteNodeMethod()
    expect(state.nodeList.domainNodeList).toStrictEqual([]);
    expect(state.nodeList.resourceNodeList).toStrictEqual(resultArray);
  });

  it("can check resetNodeLists mutations", () => {
    const returnedVal = {
      nodeList : {
        resourceNodeList: [],
        subjectNodeList: [],
        domainNodeList: []
      }
    }
    mutations.resetNodeLists(state);
    expect(state.nodeList).toStrictEqual(returnedVal.nodeList);
  });

  it("can check resetNodeFound mutations", () => {
    const returnedVal = {
      nodeFound : {
        isResourceNode: false,
        isSubjectNode: false,
        isDomainNode: false,
      }
    }
    mutations.resetNodeFound(state);
    expect(state.nodeFound).toStrictEqual(returnedVal.nodeFound);
  });

  it("can check getNodeList getters", () => {
    const stateValue = {
      nodeList:{
        resourceNodeList: [
          {
            records:"Repository",
            recordsNumber:1013,
            type:"resource"

          }
        ],
        subjectNodeList: [],
        domainNodeList: []
      }
    }

    const result = {
      resourceNodeList: [
        {
          records:"Repository",
          recordsNumber:1013,
          type:"resource"

        }
      ],
      subjectNodeList: [],
      domainNodeList: []
    }

    const builtData = getters.getNodeList(stateValue);
    expect(builtData).toStrictEqual(result);
  });

  it("can check getNodeFound getters", () => {
    const stateValue = {
      nodeFound:{
        isResourceNode: true,
        isSubjectNode: false,
        isDomainNode: false,
      }
    }

    const result = {
      isResourceNode: true,
      isSubjectNode: false,
      isDomainNode: false,
    }

    const builtData = getters.getNodeFound(stateValue);
    expect(builtData).toStrictEqual(result);
  });


})
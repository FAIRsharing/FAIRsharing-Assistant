import nodeListStore  from "@/store/nodeListStore.js"


describe('nodeListStore store methods', () => {
  const {actions, mutations, getters} = nodeListStore
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

  it("can check resetNodeLists actions", () => {
    const commit = jest.fn()
    actions.resetNodeLists({ commit })
    expect(commit).toHaveBeenCalledTimes(1);
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
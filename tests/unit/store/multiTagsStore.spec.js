import multiTagsStore from "@/store/multiTagsStore"
import sinon from "sinon"
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import MultitagData from '../../../tests/fixtures/multiTag.json'

describe('MultiTags store methods', () => {
  const {actions, mutations, getters} = multiTagsStore
  const returnedVal = MultitagData;
  let state = {
    queryParams: {},
    fairSharingRecords: [],
    error: false,
    loadingStatus: false,
    refinedStatus: false,
    currentRegistry: '',
    selectedTags: [],
    selectionMessage: ''
  };
  let stub;

  beforeAll(() => {
    stub = sinon.stub(GraphClient.prototype, "executeQuery");
    stub.returns(returnedVal);
  });

  afterAll(() => {
    stub.restore();
  });

  it("can check fetchMultiTagData actions with null parameters", async() => {
    const commit = jest.fn()
    const additionalParams = [null, null, null]
    await actions.fetchMultiTagData({ commit }, additionalParams)
    expect(commit).toHaveBeenCalledWith('setLoadingStatus', true);
  });

  it("can check fetchMultiTagData actions empty parameters", async() => {
    const commit = jest.fn()
    const additionalParams = [" ", " ", " "]
    await actions.fetchMultiTagData({ commit }, additionalParams)
    expect(commit).toHaveBeenCalledWith('setLoadingStatus', true);
  });


  it("can check resetMultiTags actions", () => {
    const commit = jest.fn()
    actions.resetMultiTags({ commit })
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check setFairSharingRecords mutations", () => {
    mutations.setFairSharingRecords(state, returnedVal);
    expect(state.fairSharingRecords).toBe(returnedVal);
  });

  it("can check setLoadingStatus mutations", () => {
    const loadingStatus = true;
    mutations.setLoadingStatus(state, loadingStatus);
    expect(state.loadingStatus).toBe(true);
  });

  it("can check resetMultiTagsRecords mutations", () => {
    const returnedVal = {
      queryParams : {},
      fairSharingRecords : [],
      error : false,
      loadingStatus : false,
      refinedStatus : false,
      currentRegistry : '',
      selectedTags : [],
      selectionMessage: ''
    }
    mutations.resetMultiTagsRecords(state);
    expect(state).toStrictEqual(returnedVal);
  });

  it("can check setQueryParams mutations", () => {
    const params = {
      dataAccessCondition: ["open"],
      fairsharingRegistry: ["database"]
    }
    mutations.setQueryParams(state, params);
    expect(state.queryParams).toStrictEqual(params);
  });

  it("can check setRefinedStatus mutations", () => {
    const refinedStatus = false
    mutations.setRefinedStatus(state, refinedStatus);
    expect(state.refinedStatus).toStrictEqual(false);
  });

  it("can check setCurrentRegistry mutations", () => {
    const currentRegistry = "Database"
    mutations.setCurrentRegistry(state, currentRegistry);
    expect(state.currentRegistry).toStrictEqual("Database");
  });

  it("can check setSelectedTags mutations", () => {
    const selectedTags = [
      {
        "name": "ABC"
      }
    ]
    mutations.setSelectedTags(state, selectedTags);
    expect(state.selectedTags).toStrictEqual(selectedTags);
  });

  it("can check setError mutations", () => {
    const errorStatus = true;
    mutations.setError(state, errorStatus);
    expect(state.error).toStrictEqual(true);
  });

  it("can check getFairSharingRecords getters", () => {
    const stateValue = {
      fairSharingRecords: [
        {
          id: 1,
          name: "ABC",
          registry:"Database",
          status:"ready",
          type:"repository"
        }
      ]
    }

    const result = [
      {
        id: 1,
        name: "ABC",
        registry:"Database",
        status:"ready",
        type:"repository"
      }
    ]

    const builtData = getters.getFairSharingRecords(stateValue);
    expect(builtData).toStrictEqual(result);

  })

  it("can check getQueryParams getters", () => {
    const stateValue = {
      queryParams: {
        dataAccessCondition: ["open"],
        fairsharingRegistry: ["database"]
      }
    }

    const result = {
      dataAccessCondition: ["open"],
      fairsharingRegistry: ["database"]
    }

    const builtData = getters.getQueryParams(stateValue);
    expect(builtData).toStrictEqual(result);

  })

  it("can check getLoadingStatus getters", () => {
    const stateValue = {
      loadingStatus: false
    }

    const result = false
    const builtData = getters.getLoadingStatus(stateValue);
    expect(builtData).toBe(result);

  })

  it("can check getRefinedStatus getters", () => {
    const stateValue = {
      refinedStatus: true
    }

    const result = true
    const builtData = getters.getRefinedStatus(stateValue);
    expect(builtData).toBe(result);

  })

  it("can check getCurrentRegistry getters", () => {
    const stateValue = {
      currentRegistry: "Database"
    }

    const result = "Database"
    const builtData = getters.getCurrentRegistry(stateValue);
    expect(builtData).toBe(result);

  })

  it("can check getSelectedTags getters", () => {
    const stateValue = {
      selectedTags: ["open"]
    }

    const result = ["open"]
    const builtData = getters.getSelectedTags(stateValue);
    expect(builtData).toStrictEqual(result);

  })

  it("can check getError getters", () => {
    const stateValue = {
      error: false
    }

    const result = false
    const builtData = getters.getError(stateValue);
    expect(builtData).toBe(result);

  })

  it("can get and set the selection message", () => {
    mutations.setSelectionMessage(state, 'banana');
    expect(state.selectionMessage).toEqual('banana');
    expect(getters.getSelectionMessage({ selectionMessage: 'two oranges' })).toEqual('two oranges');
  })

})
import {actions, mutations} from "@/store/multiTagsStore"
import sinon from "sinon"
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import MultitagData from '../../../tests/fixtures/multiTag.json'

describe('MultiTags store methods', () => {

  const returnedVal = MultitagData;
  let state = {
    fairSharingRecords: [],
    error: false,
    loadingStatus: false,
  };
  let stub;

  beforeAll(() => {
    stub = sinon.stub(GraphClient.prototype, "executeQuery");
    stub.returns(returnedVal);
  });

  afterAll(() => {
    stub.restore();
  });

  it("can check fetchMultiTagsTerms actions with null parameters", async() => {
    const commit = jest.fn()
    const additionalParams = [null, null, null]
    await actions.fetchMultiTagsTerms({ commit }, additionalParams)
    expect(commit).toHaveBeenCalledWith('setLoadingStatus', true);
  });

  it("can check fetchMultiTagsTerms actions empty parameters", async() => {
    const commit = jest.fn()
    const additionalParams = [" ", " ", " "]
    await actions.fetchMultiTagsTerms({ commit }, additionalParams)
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

  it("can check resetFairSharingRecords mutations", () => {
    mutations.resetFairSharingRecords(state);
    expect(state.fairSharingRecords).toStrictEqual([]);
  });

})
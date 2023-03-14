import {actions, mutations} from "@/store/recordTypeStore.js"
import sinon from "sinon"
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import RecordsData from '../../../tests/fixtures/recordTypes.json'

describe('RecordType store methods', () => {

  const returnedVal = RecordsData;
  let state = {
    recordTypes: [],
    allRecordTypes: [],
    error: false,
    loadingData: false,
  };

  actions.commit = jest.fn();
  let stub;

  beforeAll(() => {
    stub = sinon.stub(GraphClient.prototype, "executeQuery");
    stub.returns(returnedVal);
  });

  afterAll(() => {
    stub.restore();
  });

  it("can check fetchAllRecordTypes actions", async() => {
    const commit = jest.fn()
    await actions.fetchAllRecordTypes({ commit })
    expect(commit).toHaveBeenCalledWith('setLoadingData', true);
  });

  it("can check resetRecords actions", () => {
    const commit = jest.fn()
    actions.resetRecords({ commit })
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check setAllRecordTypes mutations", () => {
    mutations.setAllRecordTypes(state, returnedVal);
    expect(state.allRecordTypes).toBe(returnedVal);
  });

  it("can check setLoadingData mutations", () => {
    const loadingData = true;
    mutations.setLoadingData(state, loadingData);
    expect(state.loadingData).toBe(true);
  });

  it("can check resetAllRecordTypes mutations", () => {
    mutations.resetAllRecordTypes(state);
    expect(state.allRecordTypes).toStrictEqual([]);
  });

})
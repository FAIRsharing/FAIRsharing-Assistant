import variableTagStore  from "@/store/variableTagStore.js"
import sinon from "sinon"
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import VariableData from '../../../tests/fixtures/variableTag.json'

describe('VariableTag store methods', () => {
  const {actions, mutations} = variableTagStore
  const returnedVal = VariableData;
  let state = {
    variableResponse: [],
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

  it("can check resetVariableTags actions", () => {
    const commit = jest.fn()
    actions.resetVariableTags({ commit })
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check setVariableResponse mutations", () => {
    mutations.setVariableResponse(state, returnedVal);
    expect(state.variableResponse).toBe(returnedVal);
  });

  it("can check setLoadingStatus mutations", () => {
    const loadingStatus = true;
    mutations.setLoadingStatus(state, loadingStatus);
    expect(state.loadingStatus).toBe(true);
  });

  it("can check resetVariableResponse mutations", () => {
    mutations.resetVariableResponse(state);
    expect(state.variableResponse).toStrictEqual([]);
  });

})
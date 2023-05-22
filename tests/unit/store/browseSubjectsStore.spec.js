import browseSubjectsStore from "@/store/browseSubjectsStore"
import sinon from "sinon"
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import BrowseSubjectData from '../../../tests/fixtures/browseSubject.json'

describe('BrowseSubjectsStore store methods', () => {
  const {actions, mutations} = browseSubjectsStore
  const returnedVal = BrowseSubjectData.data;
  let state = {
    subjectBubbleTree: [],
    error: false,
    loadingData: false,
  };
  let stub;

  beforeAll(() => {
    stub = sinon.stub(GraphClient.prototype, "executeQuery");
    stub.returns(returnedVal);
  });

  afterAll(() => {
    stub.restore();
  });


  it("can check fetchTerms actions", async() => {
    const commit = jest.fn()
    await actions.fetchTerms({ commit })
    expect(commit).toHaveBeenCalledWith('setLoadingData', true);
  });

  it("can check leavePage actions", () => {
    const commit = jest.fn()
    actions.leavePage({ commit })
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("can check setSubjectBubbleTree mutations", () => {
    mutations.setSubjectBubbleTree(state, returnedVal);
    expect(state.subjectBubbleTree).toBe(returnedVal);
  });

  it("can check setLoadingData mutations", () => {
    const loadingData = true;
    mutations.setLoadingData(state, loadingData);
    expect(state.loadingData).toBe(true);
  });

  it("can check resetSubjectBubbleTree mutations", () => {
    mutations.resetSubjectBubbleTree(state);
    expect(state.subjectBubbleTree).toStrictEqual([]);
  });

})
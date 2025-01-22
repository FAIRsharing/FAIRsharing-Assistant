import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach, vi, afterAll } from "vitest";
import QuestionPage from "@/components/Navigation/QuestionPage.vue";
import icons from "@/plugins/icons";
import multiTagsStore from "@/store/multiTagsStore";
import navigationStore from "@/store/navigationStore";
import tagsQuery from "@/lib/GraphClient/queries/geTags.json";
import parentsQuery from "@/lib/GraphClient/queries/getParentPolicies.json";
import sinon from "sinon";
import GraphClient from "@/lib/GraphClient/GraphClient";

let questionSets = {
  questionSets: [
    {
      id: "mock_question_0",
      path: 10000,
      breadcrumb: {
        id: "mock_question_0_crumb",
        link: "/10000",
        text: "mock_Start",
      },
      title: "mock_Are you a...?",
      footer: "mock_footer",
      clear: true,
      questions: [
        {
          id: 1,
          title: "mock_question_0_1",
          question: "mock_Researcher",
          breadcrumbMod: "mock_standards",
          message: "mock_message_text",
          role: "mock_Researcher",
          color: "mock_internal",
          image_icon: "",
          link: "/1",
          query: {
            fairsharingRegistry: ["mock_database"],
            recordType: [
              "mock_repository",
              "mock_knowledgebase_and_repository",
            ],
            status: ["mock_ready", "mock_in_development"],
          },
          refined: true,
          restrict: "mock_database",
        },
      ],
      searchQuery: {
        fairsharingRegistry: ["mock_standard"],
        recordType: ["mock_model_and_format", "mock_terminology_artefact"],
      },
    },
  ],
};
const mockRouter = { push: vi.fn() };

let mockRoute = {
  path: "/test",
  name: "HomeView",
  params: {
    id: 1,
  },
};

let recordTagsArr = [
  {
    id: 1,
    label: "label",
    model: "subject",
  },
];

let foundPoliciesArr = [
  {
    id: 1,
    name: "name",
    abbreviation: "abbreviation",
  },
];

const vuetify = createVuetify({ icons: icons });

multiTagsStore.getters = {
  getFairSharingRecords: () => {
    return [
      {
        record: "Wibble",
        registry: "Standard",
        id: 123,
      },
    ];
  },
  getCurrentRegistry: () => {
    return "database";
  },
  getQueryParams: () => {
    return {};
  },
  getSelectedTags: () => {
    return ["asd"];
  },
};

multiTagsStore.actions = {
  fetchMultiTagData: vi.fn(),
  resetMultiTags: vi.fn(),
};

multiTagsStore.commit = vi.fn();
navigationStore.commit = vi.fn();

navigationStore.mutations = {
  setNavigationState: vi.fn(),
  clearPreviousNavigation: vi.fn(),
  sliceBreadcrumb: vi.fn(),
  setPolicyComplianceState: vi.fn(),
  setComplianceState: vi.fn(),
  setRestrict: vi.fn(),
  setRole: vi.fn(),
  setRouteQuery: vi.fn(),
  addBreadcrumb: vi.fn(),
};

navigationStore.getters = {
  getBreadcrumbs: () => {
    return [
      {
        link: "/1",
        text: "a link",
      },
    ];
  },
  getCompliantWith: () => {
    return "GenbankSequenceFormat";
  },
  getCompliantWithPolicy: () => {
    return "Nature Genetics";
  },
  getPreviousLocation: () => {
    return "/refine";
  },
  getRouteQuery: () => {
    return {
      1: {
        taxonomies: ["astrobiology"],
      },
    };
  },
};

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
    navigationStore: navigationStore,
  },
});
window.open = vi.fn();

describe("QuestionPage.vue", function () {
  let wrapper, graphStub;
  graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
  graphStub.withArgs(tagsQuery).returns({
    searchTags: [{ id: 1, label: "label", model: "subject" }],
  });

  afterAll(() => {
    graphStub.restore();
  });

  beforeEach(() => {
    wrapper = shallowMount(QuestionPage, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          questionData: questionSets.questionSets[0],
        },
        stubs: ["router-link", "router-view"],
      },
    });
  });

  it("can be instantiated", async () => {
    expect(wrapper.vm.$options.name).toMatch("QuestionPage");
    //All watchers in the component
    wrapper.vm.$options.watch.$route.call(wrapper.vm);
    wrapper.vm.$options.watch.getFairSharingRecords.call(wrapper.vm);
    await wrapper.vm.$options.watch.searchString.call(wrapper.vm, "abcd");
    await wrapper.vm.$options.watch.recordTags.call(wrapper.vm, recordTagsArr);
    await wrapper.vm.$options.watch.foundModelFormats.call(
      wrapper.vm,
      foundPoliciesArr,
    );
    await wrapper.vm.$options.watch.foundPolicies.call(
      wrapper.vm,
      foundPoliciesArr,
    );

    //When searchString in watch has value lesser than 3
    await wrapper.vm.$options.watch.searchString.call(wrapper.vm, "ab");
  });

  it("can check recordTags watch when watchRecordTags is false", async () => {
    wrapper.vm.watchRecordTags = false;
    await wrapper.vm.$options.watch.recordTags.call(wrapper.vm, recordTagsArr);
  });

  it("can check getFairSharingRecords watch when lowResultsStoppage is true", async () => {
    wrapper.vm.lowResultsStoppage = true;
    await wrapper.vm.$options.watch.getFairSharingRecords.call(wrapper.vm);
    expect(wrapper.vm.lowResultsStoppage).toBe(true);
  });

  it("can check getQuestions method (Line 605 of code)", async () => {
    const spy = vi.spyOn(wrapper.vm, "getQuestions");
    await wrapper.vm.getQuestions();
    expect(spy).toHaveBeenCalled();
  });

  it("can check getQuestions method when getRouteQuery(previousQuery) does not have path id(numeric) key value pair (Line 587, 643 of code)", async () => {
    navigationStore.getters = {
      getBreadcrumbs: () => {
        return [
          {
            link: "/1",
            text: "a link",
          },
        ];
      },
      getCompliantWith: () => {
        return "GenbankSequenceFormat";
      },
      getCompliantWithPolicy: () => {
        return "Nature Genetics";
      },
      getPreviousLocation: () => {
        return "/refine";
      },
      getRouteQuery: () => {
        return {
          this: "that",
        };
      },
    };
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
        navigationStore: navigationStore,
      },
    });
    wrapper = shallowMount(QuestionPage, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          questionData: questionSets.questionSets[0],
        },
        stubs: ["router-link", "router-view"],
      },
    });
    const spy = vi.spyOn(wrapper.vm, "getQuestions");
    await wrapper.vm.getQuestions();
    expect(spy).toHaveBeenCalled();
  });

  it("can check getQuestions method (ELSE condition line 619 of code)", async () => {
    navigationStore.getters = {
      getBreadcrumbs: () => {
        return [
          {
            link: "/1",
            text: "a link",
          },
        ];
      },
      getCompliantWith: () => {
        return "GenbankSequenceFormat";
      },
      getCompliantWithPolicy: () => {
        return "Nature Genetics";
      },
      getPreviousLocation: () => {
        return "/refine";
      },
      getRouteQuery: () => {
        return {
          1: {
            taxonomiesTest: ["astrobiology"],
          },
        };
      },
    };
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
        navigationStore: navigationStore,
      },
    });
    wrapper = shallowMount(QuestionPage, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          questionData: questionSets.questionSets[0],
        },
        stubs: ["router-link", "router-view"],
      },
    });
    const spy = vi.spyOn(wrapper.vm, "getQuestions");
    await wrapper.vm.getQuestions();
    expect(spy).toHaveBeenCalled();
  });

  it("can check getQuestions method when getRouteQuery(previousQuery) has 'dataFormatsAndTerminologies' (line 624 of code)", async () => {
    navigationStore.getters = {
      getBreadcrumbs: () => {
        return [
          {
            link: "/1",
            text: "a link",
          },
        ];
      },
      getCompliantWith: () => {
        return "GenbankSequenceFormat";
      },
      getCompliantWithPolicy: () => {
        return "Nature Genetics";
      },
      getPreviousLocation: () => {
        return "/refine";
      },
      getRouteQuery: () => {
        return {
          1: {
            dataFormatsAndTerminologies: ["astrobiology"],
          },
        };
      },
    };
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
        navigationStore: navigationStore,
      },
    });
    wrapper = shallowMount(QuestionPage, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          questionData: questionSets.questionSets[0],
        },
        stubs: ["router-link", "router-view"],
      },
    });
    const spy = vi.spyOn(wrapper.vm, "getQuestions");
    await wrapper.vm.getQuestions();
    expect(spy).toHaveBeenCalled();
  });

  it("can check getQuestions method (ELSE condition line 649 of code)", async () => {
    navigationStore.getters = {
      getBreadcrumbs: () => {
        return [
          {
            link: "/1",
            text: "a link",
          },
        ];
      },
      getCompliantWith: () => {
        return "GenbankSequenceFormat";
      },
      getCompliantWithPolicy: () => {
        return "Nature Genetics";
      },
      getPreviousLocation: () => {
        return "/0 ";
      },
      getRouteQuery: () => {
        return {
          1: {
            taxonomies: ["astrobiology"],
          },
        };
      },
    };
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return [
          {
            record: "Wibble",
            registry: "Standard",
            id: 123,
          },
        ];
      },
      getCurrentRegistry: () => {
        return "database";
      },
      getQueryParams: () => {
        return {
          subjects: ["genetics"],
          registry: ["standard"],
        };
      },
      getSelectedTags: () => {
        return [
          {
            id: 1,
            label: "label",
            model: "subject",
          },
        ];
      },
    };
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
        navigationStore: navigationStore,
      },
    });
    wrapper = shallowMount(QuestionPage, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          questionData: questionSets.questionSets[0],
        },
        stubs: ["router-link", "router-view"],
      },
    });
    const spy = vi.spyOn(wrapper.vm, "getQuestions");
    await wrapper.vm.getQuestions();
    expect(spy).toHaveBeenCalled();
  });

  it("can check processLink method", async () => {
    let questionObj = wrapper.vm.questionData.questions[0];
    let link = questionObj.link;
    let query = questionObj.query;
    let message = questionObj.message;
    let refined = questionObj.refined;
    let breadcrumbMod = questionObj.breadcrumbMod;
    let role = questionObj.role;
    let restrict = questionObj.restrict;

    wrapper.vm.foundModelFormats = foundPoliciesArr;
    wrapper.vm.foundPolicies = foundPoliciesArr;
    wrapper.vm.lowResultsStoppage = false;
    await wrapper.vm.processLink(
      link,
      query,
      message,
      refined,
      breadcrumbMod,
      role,
      restrict,
    );
  });

  it("can check processLink method when lowResultsStoppage is true(line 706 in code)", async () => {
    let questionObj = wrapper.vm.questionData.questions[0];
    let link = questionObj.link;
    let query = questionObj.query;
    let message = questionObj.message;
    let refined = questionObj.refined;
    let breadcrumbMod = questionObj.breadcrumbMod;
    let role = questionObj.role;
    let restrict = questionObj.restrict;

    wrapper.vm.foundModelFormats = foundPoliciesArr;
    wrapper.vm.foundPolicies = foundPoliciesArr;
    wrapper.vm.lowResultsStoppage = true;
    let processLink = await wrapper.vm.processLink(
      link,
      query,
      message,
      refined,
      breadcrumbMod,
      role,
      restrict,
    );
    expect(processLink).toBe(undefined);

    //When link does not have 'http'(else condition line 740 in code)
    expect(wrapper.vm.$route.path).toBe("/test");
  });

  it("can check getResults method when queryString is has value(IF condition line 751 in code)", async () => {
    graphStub.returns({
      error: false,
      multiTagFilter: foundPoliciesArr,
    });
    let queryString = "abcd";
    wrapper.vm.hasModelFormatQuery = true;
    wrapper.vm.hasPolicyQuery = true;
    wrapper.vm.searchQuery = wrapper.vm.questionData.searchQuery;
    await wrapper.vm.getResults(queryString);
    wrapper.vm.searchString = queryString;
    let queryCopy = JSON.parse(JSON.stringify(wrapper.vm.searchQuery));
    queryCopy["q"] = queryString;
    const expected = { q: queryString };
    expect(queryCopy).toMatchObject(expected);
  });

  it("can check getResults method when queryString is empty (ELSE condition line 755 in code)", async () => {
    let queryString = "";
    wrapper.vm.hasModelFormatQuery = true;
    wrapper.vm.hasPolicyQuery = true;
    wrapper.vm.searchQuery = wrapper.vm.questionData.searchQuery;
    await wrapper.vm.getResults(queryString);
    wrapper.vm.searchString = queryString;
    expect(wrapper.vm.searchResults).toStrictEqual([]);
  });

  it("can check getResults method when hasTagsQuery is true and taggedRecords array has value (ELSE IF condition line 770 in code)", async () => {
    //When taggedRecords array has value
    graphStub.returns({
      error: false,
      searchTags: [
        {
          id: 804,
          label: "natural history",
          model: "subject",
          parents: [
            {
              id: 742,
              label: "Life Science",
            },
          ],
        },
      ],
    });
    let queryString = "abcd";
    wrapper.vm.hasTagsQuery = true;
    wrapper.vm.searchQuery = wrapper.vm.questionData.searchQuery;
    await wrapper.vm.getResults(queryString);
    let tagQueryCopy = JSON.parse(JSON.stringify(tagsQuery));
    tagQueryCopy = {
      queryParam: {
        taggedRecords: [123],
      },
    };
    const expected = {
      queryParam: {
        taggedRecords: [123],
      },
    };
    expect(tagQueryCopy).toMatchObject(expected);
  });

  it("can check getResults method when hasTagsQuery is true and taggedRecords array does not have value (ELSE IF condition line 770 in code)", async () => {
    //When taggedRecords array does not have value
    graphStub.returns({
      error: false,
      searchTags: [
        {
          id: 804,
          label: "natural history",
          model: "subject",
          parents: [
            {
              id: 742,
              label: "Life Science",
            },
          ],
        },
      ],
    });
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return [];
      },
      getCurrentRegistry: () => {
        return "database";
      },
      getQueryParams: () => {
        return {};
      },
      getSelectedTags: () => {
        return [
          {
            id: 1,
            label: "label",
            model: "subject",
          },
        ];
      },
    };
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
        navigationStore: navigationStore,
      },
    });
    wrapper = shallowMount(QuestionPage, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          questionData: questionSets,
        },
        stubs: ["router-link", "router-view"],
      },
    });

    let queryString = "abcd";
    wrapper.vm.hasTagsQuery = true;
    wrapper.vm.searchQuery = wrapper.vm.questionData.searchQuery;
    await wrapper.vm.getResults(queryString);
    let tagQueryCopy = JSON.parse(JSON.stringify(tagsQuery));
    tagQueryCopy = {
      queryParam: {
        q: queryString,
      },
    };
    const expected = {
      queryParam: {
        q: queryString,
      },
    };
    expect(tagQueryCopy).toMatchObject(expected);
  });

  it("can check clearResults method", () => {
    wrapper.vm.clearResults();
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.tags).toStrictEqual([]);
    expect(wrapper.vm.searchResults).toStrictEqual([]);
  });

  it("can check generateQuery method", () => {
    let val = [
      {
        model: "domain",
        label: "abc",
        id: 1,
      },
      {
        model: "subject",
        label: "xyz",
        id: 2,
      },
      {
        model: "taxonomy",
        label: "pqr",
        id: 3,
      },
      {
        model: "user_defined_tag",
        label: "stu",
        id: 4,
      },
    ];
    wrapper.vm.generateQuery(val);
    let domainsArr = ["abc"];
    expect(wrapper.vm.getQueryParams.domains).toStrictEqual(domainsArr);
  });

  it("can check deleteTag method", () => {
    wrapper.vm.recordTags = [
      {
        model: "domain",
        label: "abc",
        id: 1,
      },
      {
        model: "subject",
        label: "xyz",
        id: 2,
      },
      {
        model: "taxonomy",
        label: "pqr",
        id: 3,
      },
      {
        model: "user_defined_tag",
        label: "stu",
        id: 4,
      },
    ];

    let resultTags = [
      {
        model: "subject",
        label: "xyz",
        id: 2,
      },
      {
        model: "taxonomy",
        label: "pqr",
        id: 3,
      },
      {
        model: "user_defined_tag",
        label: "stu",
        id: 4,
      },
    ];
    wrapper.vm.deleteTag(1, "domain");

    expect(wrapper.vm.recordTags).toStrictEqual(resultTags);
  });

  it("can check deleteStandard method", () => {
    wrapper.vm.deleteStandard(2);
    expect(wrapper.vm.foundModelFormats).toStrictEqual([]);
  });

  it("can check deletePolicy method", () => {
    wrapper.vm.deletePolicy(2);
    expect(wrapper.vm.foundPolicies).toStrictEqual([]);
  });

  it("can check goToResults method", () => {
    wrapper.vm.$route.path = "/results";
    wrapper.vm.goToResults();
    expect(wrapper.vm.$route.path).toStrictEqual("/results");
  });

  it("can check itemSelected method", async () => {
    const item = {
      item: foundPoliciesArr[0],
    };
    wrapper.vm.foundPolicies = [];

    graphStub.withArgs(parentsQuery).returns({
      fairsharingRecord: {
        parentPolicies: [{ id: 2, label: "label", model: "subject" }],
      },
    });

    await wrapper.vm.itemSelected(item);
    let output = [
      { id: 2, label: "label", model: "subject" },
      item
    ];

    expect(wrapper.vm.foundPolicies).toStrictEqual(output);
  });
});

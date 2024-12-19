import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import Breadcrumbs from "@/components/Navigation/Breadcrumbs.vue";
import icons from "@/plugins/icons";
import multiTagsStore from "@/store/multiTagsStore";
import navigationStore from "@/store/navigationStore";
import summaries from "@/data/navigationSummary.json";

let $route = {
  path: "/",
  name: "HomeView",
  params: {
    id: 1,
  },
};

const mockRouter = { push: vi.fn() };

const vuetify = createVuetify({ icons: icons });

multiTagsStore.getters = {
  getQueryParams: () => {
    return {
      subjects: ["genetics"],
      registry: ["standard"],
    };
  },
  getCurrentRegistry: () => {
    return "standard ";
  },
  getFairSharingRecords: () => {
    return [{}];
  },
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
  getRole: () => {
    return "Researcher";
  },
  getRestrict: () => {
    return "database";
  },
};

navigationStore.commit = vi.fn();

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
    navigationStore: navigationStore,
  },
});

describe("Breadcrumbs.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Breadcrumbs, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $route: $route,
          $router: mockRouter,
          summaries: summaries,
        },
        stubs: ["router-link"],
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("can be instantiated", () => {
    wrapper.vm.$options.watch.$route.call(wrapper.vm);
    expect(wrapper.vm.$options.name).toMatch("Breadcrumbs");
  });

  it("can check setBreadcrumb method when path is '/results'", () => {
    wrapper.vm.$route.path = "/results";
    wrapper.vm.$route.params.id = 100000;
    wrapper.vm.setBreadcrumb();
    let output = {
      id: "results_crumb",
      text: "Results",
      link: "/results",
    };

    expect(wrapper.vm.currentBreadcrumb).toStrictEqual(output);
  });

  it("can check setBreadcrumb method when path is '/educational/claim'", () => {
    wrapper.vm.$route.path = "/educational/claim";
    wrapper.vm.$route.params.id = 100000;
    wrapper.vm.setBreadcrumb();
    let output = {
      id: "educational_claim_crumb",
      text: "Claim your record(s) in FAIRsharing",
      link: "/educational/claim",
    };

    expect(wrapper.vm.currentBreadcrumb).toStrictEqual(output);
  });

  it("can check setBreadcrumb method when path is '/educational/register'", () => {
    wrapper.vm.$route.path = "/educational/register";
    wrapper.vm.$route.params.id = 100000;
    wrapper.vm.setBreadcrumb();
    let output = {
      id: "eductional_register_crumb",
      text: "Register your resources(s) with FAIRsharing",
      link: "/educational/register",
    };

    expect(wrapper.vm.currentBreadcrumb).toStrictEqual(output);
  });

  it("can check setBreadcrumb method when path is '/refine'", () => {
    wrapper.vm.$route.path = "/refine";
    wrapper.vm.$route.params.id = 100000;
    wrapper.vm.setBreadcrumb();
    let output = {
      id: "refine_crumb",
      text: "Refine your choice",
      link: "/refine",
    };

    expect(wrapper.vm.currentBreadcrumb).toStrictEqual(output);
  });

  it("can check handleNavigation method", () => {
    wrapper.vm.$route.params.id = 1;
    wrapper.vm.handleNavigation("/1");
    expect(wrapper.vm.path).toBe("/1");

    //When params.id is 0
    wrapper.vm.$route.params.id = 0;
    wrapper.vm.$route.path = "/";
    wrapper.vm.handleNavigation("/1");
    expect(wrapper.vm.path).toBe("/");
  });

  it("can check formatBreadcrumb method when parameter includes text 'FORMAT'", () => {
    let crumb = {
      text: "abc FORMAT",
    };
    let output = "abc GenbankSequenceFormat";
    wrapper.vm.formatBreadcrumb(crumb);
    expect(wrapper.vm.formatBreadcrumb(crumb)).toBe(output);
  });

  it("can check formatBreadcrumb method when parameter includes text 'POLICY'", () => {
    let crumb = {
      text: "abc POLICY",
    };
    //When getCompliantWithPolicy getter has length lesser than 2
    let output = "abc Nature Genetics";
    wrapper.vm.formatBreadcrumb(crumb);
    expect(wrapper.vm.formatBreadcrumb(crumb)).toBe(output);

    //When getCompliantWithPolicy getter has length greater than 2
    navigationStore.getters = {
      getCompliantWith: () => {
        return "GenbankSequenceFormat";
      },
      getCompliantWithPolicy: () => {
        return "Nature Genetics, test1, test2";
      },
      getRole: () => {
        return "Researcher";
      },
      getRestrict: () => {
        return "database";
      },
    };
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
        navigationStore: navigationStore,
      },
    });
    wrapper = shallowMount(Breadcrumbs, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $route: $route,
          $router: mockRouter,
          summaries: summaries,
        },
        stubs: ["router-link"],
      },
    });
    let outputText = "abc 3 policies";
    wrapper.vm.formatBreadcrumb(crumb);
    expect(wrapper.vm.formatBreadcrumb(crumb)).toBe(outputText);

    //When getCompliantWithPolicy getter does not have any value ELSE condition
    navigationStore.getters = {
      getCompliantWith: () => {
        return "GenbankSequenceFormat";
      },
      getCompliantWithPolicy: () => {
        return "";
      },
      getRole: () => {
        return "Researcher";
      },
      getRestrict: () => {
        return "database";
      },
    };
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
        navigationStore: navigationStore,
      },
    });
    wrapper = shallowMount(Breadcrumbs, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $route: $route,
          $router: mockRouter,
          summaries: summaries,
        },
        stubs: ["router-link"],
      },
    });
    let outputResult = "No policy selected!";
    wrapper.vm.formatBreadcrumb(crumb);
    expect(wrapper.vm.formatBreadcrumb(crumb)).toBe(outputResult);
  });

  it("can check formatBreadcrumb method when parameter includes text 'Resource type'", () => {
    let crumb = {
      text: "...Resource type",
    };

    let output = "Resource type";
    wrapper.vm.formatBreadcrumb(crumb);
    expect(wrapper.vm.formatBreadcrumb(crumb)).toBe(output);
  });

  it("can check formatBreadcrumb method when parameter includes text 'Research area'", () => {
    let crumb = {
      text: "...Research area",
    };

    let output = "<b>genetics</b>Research area";
    wrapper.vm.formatBreadcrumb(crumb);
    expect(wrapper.vm.formatBreadcrumb(crumb)).toBe(output);
  });

  it("can check formatBreadcrumb method when parameter does not includes text 'Research area i.e. ELSE condition'", () => {
    let crumb = {
      text: "Research area test",
    };

    let output = "Research area test";
    wrapper.vm.formatBreadcrumb(crumb);
    expect(wrapper.vm.formatBreadcrumb(crumb)).toBe(output);
  });

  it("can check copySummary method TRY block", async () => {
    let clipboardContents = "";
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn((text) => {
          clipboardContents = text;
        }),
        readText: vi.fn(() => clipboardContents),
      },
    });

    await wrapper.vm.copySummary();
    await expect(clipboardContents).toHaveBeenCalled;
  });

  it("can check getSummaryText method", () => {
    //When path is '/refine'
    wrapper.vm.$route.path = "/refine";
    wrapper.vm.getSummaryText();
    expect(wrapper.vm.summaryKey).toBe("refine");

    //When path is '/results'
    wrapper.vm.$route.path = "/results";
    wrapper.vm.getSummaryText();
    expect(wrapper.vm.summaryKey).toBe("results");

    //Else
    wrapper.vm.$route.path = "/";
    wrapper.vm.$route.params.id = 1;
    wrapper.vm.getSummaryText();
    expect(wrapper.vm.summaryKey).toBe("1");
  });

  it("can check getSummaryText method when params.id does not matched with ids in summaries json", () => {
    wrapper.vm.$route.params.id = 100;
    wrapper.vm.getSummaryText();
    expect(wrapper.vm.getSummaryText()).toBe(null);
  });

  it("can check getSummaryText method when text from summaries.json includes 'STANDARD_4'", () => {
    wrapper.vm.$route.params.id = 4;
    wrapper.vm.summaries["4"] = "STANDARD_4";
    wrapper.vm.getSummaryText();

    let outputText =
      "You have selected the following relevant standards <b>GenbankSequenceFormat</b>";

    expect(wrapper.vm.getSummaryText()).toBe(outputText);
  });

  it("can check getSummaryText method when text from summaries.json includes 'STANDARD_4' but does not have value in getCompliantWith getter", () => {
    navigationStore.getters = {
      getCompliantWith: () => {
        return "";
      },
    };
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
        navigationStore: navigationStore,
      },
    });
    wrapper = shallowMount(Breadcrumbs, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $route: $route,
          $router: mockRouter,
          summaries: summaries,
        },
        stubs: ["router-link"],
      },
    });

    wrapper.vm.$route.params.id = 4;
    wrapper.vm.summaries["4"] = "STANDARD_4";
    wrapper.vm.getSummaryText();

    let outputText =
      "You have not selected any relevant standards for your data";

    expect(wrapper.vm.getSummaryText()).toBe(outputText);
  });

  it("can check getSummaryText method when text from summaries.json includes 'ROLE' having values for getRole and getRestrict getters", () => {
    navigationStore.getters = {
      getRole: () => {
        return "Researcher";
      },
      getRestrict: () => {
        return "database";
      },
    };
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
        navigationStore: navigationStore,
      },
    });
    wrapper = shallowMount(Breadcrumbs, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $route: $route,
          $router: mockRouter,
          summaries: summaries,
        },
        stubs: ["router-link"],
      },
    });

    wrapper.vm.$route.params.id = 1;
    wrapper.vm.summaries["1"] = "ROLE";
    wrapper.vm.getSummaryText();

    let outputText =
      "The FAIRsharing Assistant is set to the <b>Researcher</b> role. We have restricted the available databases to those appropriate for data deposition, which means they: are repositories or knowledgebases/repositories, have a life cycle status of Ready or In development.";

    expect(wrapper.vm.getSummaryText()).toBe(outputText);
  });

  it("can check getSummaryText method when text from summaries.json includes 'ROLE' does not have values for getRestrict getters", () => {
    navigationStore.getters = {
      getRole: () => {
        return "Researcher";
      },
      getRestrict: () => {
        return null;
      },
    };
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
        navigationStore: navigationStore,
      },
    });
    wrapper = shallowMount(Breadcrumbs, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $route: $route,
          $router: mockRouter,
          summaries: summaries,
        },
        stubs: ["router-link"],
      },
    });

    wrapper.vm.$route.params.id = 1;
    wrapper.vm.summaries["1"] = "ROLE";
    wrapper.vm.getSummaryText();

    let outputText =
      "The FAIRsharing Assistant is set to the <b>Researcher</b> role.";

    expect(wrapper.vm.getSummaryText()).toBe(outputText);
  });

  it("can check prepareFilterSummary method", () => {
    wrapper.vm.prepareFilterSummary();
    expect(wrapper.vm.prepareFilterSummary()).toBe(
      "Subjects: genetics<br>Registry: standard<br>",
    );
  });
});

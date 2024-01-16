import navigationStore from "@/store/navigationStore";

describe('Navigation store methods', () => {
  const { mutations, getters} = navigationStore
  let state = {
    previousLocation: '/1',
    breadcrumbs: {
      "/0": {
        link: '/0',
        text: 'home'
      },
      "/1": {
        link: '/1',
        text: 'start'
      },
      "/2": {
        link: '/2',
        text: 'researcher'
      },
      "/3": {
        link: '/3',
        text: 'upload data'
      }
    },
    routeQueries: {
      "/0": {},
      "/1": {},
    },
    compliantWith: null,
    compliantWithPolicy: null,
    restrict: null
  };

  it("can run setNavigationState mutation", () => {
    mutations.setNavigationState(state, '/2');
    expect(state.previousLocation).toBe('/2');
  });

  it("can get previous location", () => {
    expect(getters.getPreviousLocation(state)).toEqual('/2');
  });

  it("can set compliance", () => {
    mutations.setComplianceState(state, 'Genbank Sequence Format');
    expect(state.compliantWith).toBe('Genbank Sequence Format');
  });

  it("can set policy compliance", () => {
    mutations.setPolicyComplianceState(state, 'Nature Genetics');
    expect(state.compliantWithPolicy).toBe('Nature Genetics');
  });

  it("can get compliance", () => {
    expect(getters.getCompliantWith(state)).toEqual('Genbank Sequence Format');
  });

  it("can get policy compliance", () => {
    expect(getters.getCompliantWithPolicy(state)).toEqual('Nature Genetics');
  });

  it("can get breadcrumbs", () => {
    expect(getters.getBreadcrumbs(state)).toStrictEqual(
      {
        "/0": {
          link: '/0',
          text: 'home'
        },
        "/1": {
          link: '/1',
          text: 'start'
        },
        "/2": {
          link: '/2',
          text: 'researcher'
        },
        "/3": {
          link: '/3',
          text: 'upload data'
        }
      }
    )
    mutations.addBreadcrumb(state,{link: '/4', text: "another crumb"});
    expect(getters.getBreadcrumbs(state)).toStrictEqual(
      {
        "/0": {
          link: '/0',
          text: 'home'
        },
        "/1": {
          link: '/1',
          text: 'start'
        },
        "/2": {
          link: '/2',
          text: 'researcher'
        },
        "/3": {
          link: '/3',
          text: 'upload data'
        },
        "/4": {
          link: '/4',
          text: 'another crumb'
        }
      }
    )
    mutations.removeBreadcrumb(state, {link: '/4', text: 'another crumb'});
    expect(getters.getBreadcrumbs(state)).toStrictEqual(
      {
        "/0": {
          link: '/0',
          text: 'home'
        },
        "/1": {
          link: '/1',
          text: 'start'
        },
        "/2": {
          link: '/2',
          text: 'researcher'
        },
        "/3": {
          link: '/3',
          text: 'upload data'
        }
      }
    )
  })

  it("can slice breadcrumbs", () => {
    mutations.sliceBreadcrumb(state,'/3');
    expect(getters.getBreadcrumbs(state)).toStrictEqual(
      {
        "/0": {
          link: '/0',
          text: 'home'
        },
        "/1": {
          link: '/1',
          text: 'start'
        },
        "/2": {
          link: '/2',
          text: 'researcher'
        }
      }
    )
  });

  it("can get and set queries for a previously-visited route", () => {
    let query = {"this": "that"};
    mutations.setRouteQuery(state, ['/2', query]);
    expect(getters.getRouteQuery(state)).toStrictEqual(
      {
        "/0": {},
        "/1": {},
        "/2": query
      });
  });

  it("can remove route queries", () => {
    mutations.clearPreviousNavigation(state, '1');
    expect(getters.getRouteQuery(state)).toStrictEqual(
      {
        "/0": {},
        "/1": {}
      }
    )
  });


  it("can clear navigation state", () => {
    let returnVal = {
      previousLocation: null,
      compliantWith: null,
      compliantWithPolicy: null,
      role: null,
      breadcrumbs: {},
      routeQueries: {},
      restrict: null
    }
    mutations.clearNavigation(state);
    expect(state).toStrictEqual(returnVal);
  })

  it("can get previous location when that's empty", () => {
    expect(getters.getPreviousLocation(state)).toEqual('/0');
  });

  it('can get and set role', () => {
    expect(getters.getRole(state)).toBe(null);
    mutations.setRole(state, "Lord High Executioner");
    expect(getters.getRole(state)).toEqual("Lord High Executioner");
  })

  it('can get and set restrict', () => {
    expect(getters.getRestrict(state)).toBe(null);
    mutations.setRestrict(state, "policy");
    expect(getters.getRestrict(state)).toEqual("policy");
  })


})
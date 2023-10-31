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
    routeQueries: {},
    compliantWith: null
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

  it("can get compliance", () => {
    expect(getters.getCompliantWith(state)).toEqual('Genbank Sequence Format');
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
    mutations.setRouteQuery(state, '/1', query);
    expect(getters.getRouteQuery(state)).toStrictEqual({ '/1': query });
  });

  it("can clear navigation state", () => {
    let returnVal = {
      previousLocation: null,
      compliantWith: null,
      breadcrumbs: {},
      routeQueries: {}
    }
    mutations.clearNavigation(state);
    expect(state).toStrictEqual(returnVal);
  })

})
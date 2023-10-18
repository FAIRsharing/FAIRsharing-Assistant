import navigationStore from "@/store/navigationStore";

describe('Navigation store methods', () => {
  const { mutations, getters} = navigationStore
  let state = {
    previousLocation: '/1',
    breadcrumbs: [
      {
        link: '/0',
        text: 'home'
      },
      {
        link: '/1',
        text: 'start'
      },
      {
        link: '/2',
        text: 'researcher'
      },
      {
        link: '/3',
        text: 'upload data'
      }
    ]
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
      [
        {
          link: '/0',
          text: 'home'
        },
        {
          link: '/1',
          text: 'start'
        },
        {
          link: '/2',
          text: 'researcher'
        },
        {
          link: '/3',
          text: 'upload data'
        }
      ]
    )
    mutations.pushBreadcrumb(state, {link: '/4', text: "another crumb"});
    expect(getters.getBreadcrumbs(state)).toStrictEqual(
      [
        {
          link: '/0',
          text: 'home'
        },
        {
          link: '/1',
          text: 'start'
        },
        {
          link: '/2',
          text: 'researcher'
        },
        {
          link: '/3',
          text: 'upload data'
        },
        {
          link: '/4',
          text: 'another crumb'
        }
      ]
    )
    mutations.popBreadcrumb(state);
    expect(getters.getBreadcrumbs(state)).toStrictEqual(
      [
        {
          link: '/0',
          text: 'home'
        },
        {
          link: '/1',
          text: 'start'
        },
        {
          link: '/2',
          text: 'researcher'
        },
        {
          link: '/3',
          text: 'upload data'
        }
      ]
    )
    mutations.sliceBreadcrumb(state, 1);
    expect(getters.getBreadcrumbs(state)).toStrictEqual(
      [
        {
          link: '/0',
          text: 'home'
        },
      ]
    )
  })


  it("can clear navigation state", () => {
    let returnVal = {
      previousLocation: null,
      compliantWith: null,
      breadcrumbs: []
    }
    mutations.clearNavigation(state);
    expect(state).toStrictEqual(returnVal);
  })

})
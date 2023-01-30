<template>
  <div
    class="navSecond d-flex justify-space-around align-center full-width"
  >
    <nav class="full-width">
      <ul
        class="d-flex flex-row align-center px-0 justify-space-around"
      >
        <li
          v-for="(item, itemIndex) in links"
          :key="'navBarTopMenuItem_' + itemIndex"
          class="ma-5"
        >
          <v-btn
            :small="$vuetify.breakpoint.mdAndDown"
            :x-large="$vuetify.breakpoint.xlOnly"
            class="mr-1 mt-sm-1 menuLinks"
            :class="{'px-2': $vuetify.breakpoint.lgAndDown}"
            :color="item.color"
            :outlined="!item.active"
            :to="item.link"
            width="100%"
            min-width="167px"
            max-width="184px"
          >
            <span :class="['white--text',{'primary--text': !item.active}, {'accent3--text': item.primary && !item.active}]">{{ item.label }}</span>
          </v-btn>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Menu",
  data () {
    return {
      links: [
        {
          label: "Resource",
          name: "Resource",
          link: "/resource",
          color: "accent3",
          active: false,
          primary: true
        },
        {
          label: "Subject",
          name: "Subject",
          link: "/subject",
          color: "accent3",
          active: false,
          primary: true
        },
        {
          label: "Subject_1",
          name: "Subject_1",
          link: "/subject_1",
          color: "accent3",
          active: false,
          primary: true
        },
        {
          label: "Domain",
          name: "Domain",
          link: "/domain",
          color: "accent3",
          active: false,
          primary: true
        },
      ],
    }
  },

}
</script>


<style scoped>
ul li {
  list-style-type: none;
}

</style>

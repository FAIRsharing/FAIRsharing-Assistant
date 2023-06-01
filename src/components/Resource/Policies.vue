<template>
  <div>
    <v-fade-transition v-if="loading">
      <v-overlay
        :absolute="false"
        opacity="0.8"
      >
        <Loaders />
      </v-overlay>
    </v-fade-transition>
    <div
      ref="breadcrumbdiv"
      class="breadcrumbs my-8"
    >
      <span
        v-for="(name, i) in getBreadCrumbs"
        :key="name"
        class="breadCrumbName"
      >{{ name }}
        <span
          v-if="i+1 < getBreadCrumbs.length"
          class="connector"
        > >
        </span>
      </span>
    </div>
    <div
      id="resourceBubbleChart"
      ref="chartdiv"
      class="charts"
    />
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex"
import calculateResourceRecords from "@/utils/ResourceUtils/calculateResourceRecords"
import createResourceStructure from "@/utils/ResourceUtils/createResourceStructure"
import StringMixin from "@/utils/Others/stringMixin.js"
import Loaders from "@/components/Loaders/Loaders"
import totalResourceRecords from "@/utils/ResourceUtils/totalResourceRecords"
import {forceGraph, parseLevel, svgGraph, toggle, update} from "@/lib/D3GraphClient";
import getRecords from "@/utils/Others/getRecords";
import getResourceRecords from "@/utils/ResourceUtils/getResourceRecords";

export default {
  name: 'Policies',
  components: { Loaders },
  mixins: [StringMixin, calculateResourceRecords, createResourceStructure],
  data:() => {
    return {
      loading: false,
      fairSharingButton: false,
      showResourceSelected: false,
      allResourceData: {},
      itemClicked: "",
      recordTypesList: [],
      subjectSelected: "",
      domainSelected: "",
      policyData: [],
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource','getResource','getSubject', 'getDomain']),
    ...mapGetters("otherResourcesSelectedStore", ["getOtherResourceSelected"]),
    ...mapGetters("breadCrumbStore", ["getBreadCrumbs"]),
    ...mapState("recordTypeStore", ["allRecordTypes", "loadingData"]),
    ...mapGetters("nodeListStore", ["getNodeList"]),
  },
  watch:{
    getTopResource(){
      this.onBubbleSelection()
    }
  },
  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      await this.displayResources()
      await this.d3Chart()
      this.loading = false
    })

  },
  destroyed() {
    this.leavePage()
    this.resetVariableTags()
    this.resetRecords()
    this.resetbreadCrumbs()
    this.resetOtherResourceSelected()
  },
  methods: {
    ...mapActions("browseSubjectsStore", ["leavePage"]),
    ...mapActions("variableTagStore", [ "resetVariableTags"]),
    ...mapActions("recordTypeStore", ["fetchAllRecordTypes", "resetRecords"]),
    ...mapActions("breadCrumbStore", ["resetbreadCrumbs"]),
    ...mapActions("otherResourcesSelectedStore", ["resetOtherResourceSelected"]),

    onBubbleSelection() {
      this.fairSharingButton = true
      this.showResourceSelected = true
      this.$emit('enableFairSharingButton', this.fairSharingButton)
      this.$emit('showResourceSelected', this.showResourceSelected)
    },

    async displayResources() {
      const { subjectNodeList, domainNodeList } = this.getNodeList
      this.allResourceData = await this.createResourceStructure("Policy")
      // this.policyData = this.allResourceData["children"].filter(({name}) => name)
      // const otherResources = this.policyData.map(({children}) => children)
      // const otherResourceType = otherResources.flatMap(child => child)
      this.policyData = this.allResourceData["children"][0]
      const otherResourceType = this.policyData["children"]

      //When No Subject and Domain is selected
      if (subjectNodeList.length === 0 && domainNodeList.length === 0) {
        // eslint-disable-next-line no-console
        console.log("ALL Policies")
        await this.calculateRecords(getResourceRecords(this.policyData), null, null, otherResourceType)

        const totalRecords = totalResourceRecords(this.getOtherResourceSelected)
        this.allResourceData["children"][0].records_count
            = totalRecords
      }
      //When Subject/Domain is/are selected
      else{
        this.subjectSelected =  subjectNodeList.length ? getRecords(subjectNodeList) : null
        this.domainSelected =  domainNodeList.length ? getRecords(domainNodeList) : null
        await this.calculateRecords(null, this.subjectSelected, this.domainSelected, otherResourceType)
      }
    },

    /**
     * Plotting the hierarchy bubble chart using d3Js library
     */
    async d3Chart() {
      const routeName = this.$route.name
      const force = forceGraph()
      const divSelected = this.$refs.chartdiv;
      const svg = svgGraph(divSelected)
      const root = this.allResourceData
      parseLevel(root, 0);

      // Initialize the display to show level 1
      root.children.forEach(toggle);
      update(root, force, svg, divSelected, routeName);
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/lib/D3GraphClient/Styles/d3graph.scss";
</style>

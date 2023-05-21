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
      ref="chartdiv"
      class="bubbleChart"
    />
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex"
import StringMixin from "@/utils/Others/stringMixin.js"
import RecordTypes from "@/utils/Others/recordTypes.js";
import Loaders from "@/components/Loaders/Loaders"
import calculateRecords from "@/utils/Others/calculateRecords";
import { svgGraph, forceGraph, parseLevel, update, toggle } from "@/lib/D3GraphClient";
import getRecords from "@/utils/Others/getRecords";

export default {
  name: 'DomainType',
  components: { Loaders },
  mixins: [StringMixin, RecordTypes, calculateRecords],
  data:() => {
    return {
      loading: false,
      fairSharingButton: false,
      showDomainSelected: false,
      resourceSelected: "" || [],
      subjectSelected: "",
      allDomainData: {},
      itemClicked: "",
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource', 'getResource', 'getSubject', 'getDomain']),
    ...mapGetters("addOnFilterSelectedStore", ["getFilters"]),
    ...mapGetters("breadCrumbStore", ["getBreadCrumbs"]),
    ...mapState("recordTypeStore", ["allRecordTypes", "loadingData"]),
    ...mapState("variableTagStore", ["variableResponse", "loadingStatus"]),
    ...mapGetters("nodeListStore", ["getNodeList"]),
  },
  watch:{
    getDomain(){
      this.onBubbleSelection()
    }
  },
  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      await this.displayDomains()
      await this.d3Chart()
      this.loading = false
    })
  },
  destroyed() {
    this.leavePage()
    this.resetVariableTags()
    this.resetRecords()
    this.resetbreadCrumbs()
  },
  methods: {
    ...mapActions("browseSubjectsStore", ["leavePage"]),
    ...mapActions("recordTypeStore", ["fetchAllRecordTypes", "resetRecords"]),
    ...mapActions("variableTagStore", ["fetchVariableTags", "resetVariableTags"]),
    ...mapActions("breadCrumbStore", ["resetbreadCrumbs"]),

    onBubbleSelection() {
      this.fairSharingButton = true
      this.showDomainSelected = true
      this.$emit('enableFairSharingButton', this.fairSharingButton)
      this.$emit('showDomainSelected', this.showDomainSelected)
    },


    async displayDomains() {
  
      const { resourceNodeList, subjectNodeList } = this.getNodeList
      let resourceDataList = []
      const topResourceData = await this.allOtherRecordTypes(this.resourceSelected)
      const otherResourceData = resourceNodeList.filter(({type}) => type !== "resourceParent")
      const isTopResource = resourceNodeList.some(({type}) => type === "resourceParent")
      if (isTopResource) {
        resourceDataList = topResourceData.concat(getRecords(otherResourceData))
      }
      else {
        resourceDataList = getRecords(resourceNodeList)
      }
      this.resourceSelected = resourceNodeList.length ? resourceDataList : null
      this.subjectSelected =  subjectNodeList.length ? getRecords(subjectNodeList) : null

      this.allDomainData = await this.calculateRecords(this.resourceSelected, this.subjectSelected, null, "domain", this.getFilters)

    },
    async d3Chart() {
      const routeName = this.$route.name
      const force = forceGraph()
      const divSelected = this.$refs.chartdiv;
      const svg = svgGraph(divSelected)
      const root = this.allDomainData
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
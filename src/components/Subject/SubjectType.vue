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
import { mapState, mapActions, mapGetters } from "vuex"
import StringMixin from "@/utils/Others/stringMixin.js"
import RecordTypes from "@/utils/Others/recordTypes.js";
import Loaders from "@/components/Loaders/Loaders"
import calculateRecords from "@/utils/Others/calculateRecords";
import { svgGraph, forceGraph, parseLevel, update, toggle } from "@/lib/D3GraphClient";
import getRecords from "@/utils/Others/getRecords";
export default {
  name: 'SubjectType',
  components: { Loaders },
  mixins: [StringMixin, RecordTypes, calculateRecords],
  data:() => {
    return {
      loading: false,
      fairSharingButton: false,
      showSubjectSelected: false,
      resourceSelected: "" || [],
      domainSelected: "",
      allSubjectsData: {},
      itemClicked: "",
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource','getResource','getSubject', 'getDomain']),
    ...mapGetters("addOnFilterSelectedStore", ["getFilters"]),
    ...mapGetters("breadCrumbStore", ["getBreadCrumbs"]),
    ...mapState("recordTypeStore", ["allRecordTypes", "loadingData"]),
    ...mapState("variableTagStore", ["variableResponse", "loadingStatus"]),
    ...mapState("browseSubjectsStore", ["subjectBubbleTree", "loadingData"]),
    ...mapGetters("nodeListStore", ["getNodeList"]),
  },
  watch:{
    getSubject(){
      this.onBubbleSelection()
    }
  },
  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      await this.displaySubjects()
      await this.d3Chart()
      this.loading = false
    })
  },
  destroyed() {
    this.leavePage()
    this.resetVariableTags()
    this.resetRecords()
    this.resetbreadCrumbs()
    this.resetAllSubjects()
  },
  methods: {
    ...mapActions("browseSubjectsStore", ["fetchTerms", "leavePage"]),
    ...mapActions("variableTagStore", ["fetchVariableTags", "resetVariableTags"]),
    ...mapActions("recordTypeStore", ["fetchAllRecordTypes", "resetRecords"]),
    ...mapActions("breadCrumbStore", ["resetbreadCrumbs"]),
    ...mapActions("bubbleSelectedStore", ["resetAllSubjects"]),

    onBubbleSelection() {
      this.fairSharingButton = true
      this.$emit('enableFairSharingButton', this.fairSharingButton)
    },

    async displaySubjects() {
      const { resourceNodeList, domainNodeList } = this.getNodeList

      //When No Resource and Domain is selected
      if(resourceNodeList.length === 0 && domainNodeList.length === 0) {
        // eslint-disable-next-line no-console
        console.log("ALL SUBJECTS")
        this.$store.commit("bubbleSelectedStore/allSubjectsSelected", true)
        await this.fetchTerms()
        this.allSubjectsData = {
          name: "Subject",
          value: 0,
          children: '',
        }
        this.allSubjectsData["children"] = this.subjectBubbleTree
      }
      //When Resource/Domain is/are selected
      else {
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
        this.domainSelected =  domainNodeList.length ? getRecords(domainNodeList) : null
        this.allSubjectsData = await this.calculateRecords(this.resourceSelected, null, this.domainSelected, "subject", this.getFilters)
      }
    },

    async d3Chart() {
      const routeName = this.$route.name
      const force = forceGraph()
      const divSelected = this.$refs.chartdiv;
      const svg = svgGraph(divSelected)
      const root = this.allSubjectsData
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

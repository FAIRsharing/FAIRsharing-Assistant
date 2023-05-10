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
    ...mapState("topSubjectStore", ["topSubjectBubbleTree", "loadingData"]),
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
      this.showSubjectSelected = true
      this.$emit('enableFairSharingButton', this.fairSharingButton)
      this.$emit('showSubjectSelected', this.showSubjectSelected)
    },

    async displaySubjects() {
      //When user lands on subject type after selecting the TopResource & domainType type
      if(this.getTopResource !== '' && this.getResource === '' && this.getDomain !== ''){
        // eslint-disable-next-line no-console
        console.log("TOP RESOURCE & DOMAIN")
        await this.allOtherRecordTypes(this.resourceSelected)
        this.domainSelected = this.getDomain.toLowerCase()
        this.allSubjectsData = await this.calculateRecords(this.resourceSelected, null, this.domainSelected, "subject", this.getFilters)
      }

      //When user lands on subject type after selecting the resource & domain type
      if (this.getResource !== '' && this.getDomain !== '') {
        // eslint-disable-next-line no-console
        console.log("OTHER RESOURCE & DOMAIN")
        this.resourceSelected = this.formatString(this.getResource)
        this.domainSelected = this.getDomain.toLowerCase()
        this.allSubjectsData = await this.calculateRecords(this.resourceSelected, null, this.domainSelected, "subject", this.getFilters)
      }

      //When user lands on subject type after selecting the TOP Resource type
      if(this.getTopResource !== '' && this.getResource === '' && this.getDomain === '') {
        // eslint-disable-next-line no-console
        console.log("ONLY TOP RESOURCE")
        await this.allOtherRecordTypes(this.resourceSelected)
        this.allSubjectsData = await this.calculateRecords(this.resourceSelected, null, null, "subject", this.getFilters)
      }
      //When user lands on subject type after selecting the resource type
      if(this.getResource !== '' && this.getDomain === '') {
        // eslint-disable-next-line no-console
        console.log("ONLY OTHER RESOURCE")
        this.resourceSelected = this.formatString(this.getResource)
        this.allSubjectsData = await this.calculateRecords(this.resourceSelected, null, null, "subject", this.getFilters)
      }
      //When user lands on subject type after selecting the domain type
      if (this.getTopResource === '' && this.getResource === '' && this.getDomain !== ''){
        // eslint-disable-next-line no-console
        console.log("ONLY DOMAIN")
        this.domainSelected = this.getDomain.toLowerCase()
        this.allSubjectsData = await this.calculateRecords(null, null, this.domainSelected, "subject", this.getFilters)
      }
      //When user lands on subject type as the entry point in the application
      if(this.getTopResource ==="" && this.getResource === '' && this.getDomain === '') {
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

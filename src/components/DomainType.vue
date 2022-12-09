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

    <div id="domainBubbleChart" class="charts" ref="chartdiv" />

  </div>

</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex"
import * as am5 from '@amcharts/amcharts5';
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { canvasGetImageData } from "@/utils/canvasRenderingContext"
import { breadCrumbBar } from "@/utils/breadCrumbBar"
import StringMixin from "@/utils/stringMixin.js"
import Loaders from "@/components/Loaders"

// const restClient = new RestClient();

export default {
  name: 'DomainType',
  components: { Loaders },
  mixins: [StringMixin],
  data:() => {
    return {
      loading: false,
      fairSharingButton: false,
      showDomainSelected: false,
      allRecords: [],
      variableFilter: false,
      allDomainData: {
        label: "Domain",
        name: "Domain",
        value: 0,
        children: "",
      },
      itemClicked: "",
      recordTypesList: [],
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource', 'getResource', 'getSubject', 'getDomain']),
    ...mapState("topDomainsStore", ["domainsType", "loadingData"]),
    ...mapState("recordTypeStore", ["allRecordTypes", "recordTypes", "loadingData"]),
    ...mapState("variableTagStore", ["variableResponse", "loadingStatus"]),
    ...mapState("multiTagsStore", ["domains", "loadingStatus"]),
  },

  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      await this.displayDomains()
      await this.getCircles()
      this.loading = false
    })
  },
  destroyed() {
    this.leavePage()
  },
  methods: {
    ...mapActions("recordTypeStore", ["fetchRecordTypes", "fetchAllRecordTypes"]),
    ...mapActions("subjectStore", ["fetchSubjectRecords"]),
    ...mapActions("topDomainsStore", ["fetchTopDomainTerms", "leavePage"]),
    ...mapActions("variableTagStore", ["fetchVariableTags"]),
    ...mapActions("multiTagsStore", ["fetchMultiTagsTerms"]),

    onBubbleSelection() {
      this.fairSharingButton = true
      this.showDomainSelected = true
      this.$emit('enableFairSharingButton', this.fairSharingButton)
      this.$emit('showDomainSelected', this.showDomainSelected)
    },

    // countChildren(domain) {
    //   domain["totalChildren"] = 0;
    //   if (domain["children"] && domain["children"].length) {
    //     for (const child of domain["children"]){
    //       domain["totalChildren"] += this.countChildren(child);
    //     }
    //   }
    //   return domain["totalChildren"];
    // },

    async displayDomains() {
      //When user lands on domain type after selecting the TOPResource type
      if(this.getTopResource !== '' && this.getResource === '' && !Object.keys(this.getSubject).length){
        console.log("ONLY TOP RESOURCE")
        // this.resourceSelected = this.getTopResource.toLowerCase()


        if (this.getTopResource.toLowerCase() === 'database'){
          this.resourceSelected =  ["repository", "knowledgebase", "knowledgebase_and_repository"]
        }
        else if (this.getTopResource.toLowerCase() === 'standards') {
          this.resourceSelected =  ["model_and_format", "metric", "terminology_artefact", "reporting_guideline", "identifier_schema"]
        }
        else if (this.getTopResource.toLowerCase() === 'policies') {
          this.resourceSelected =  ["journal", "journal_publisher", "society", "funder", "project", "institution"]
        }

        console.log("this.resourceSelected::", this.resourceSelected)



        //Using topDomains query instead variableFilter query because it is taking more
        //than 30secs to get the content which is making the page unresponsive
        await this.fetchTopDomainTerms(this.resourceSelected)
        console.log("this.domainsType::", this.domainsType)
        this.allDomainData["children"] = this.domainsType
        for (let child of this.allDomainData["children"]) {
          if (child["children"] && child["children"].length) {
            child["totalChildren"] = child["children"].length
          }
        }



        // //Using variableFilter query
        // this.variableFilter = true
        // await this.fetchVariableTags([this.resourceSelected, null, null, 'domain'])
        // console.log("this.variableResponse::", this.variableResponse)
        //
        //
        // this.allDomainData["children"] = this.variableResponse
        // console.log("this.allDomainData[\"children\"]::", this.allDomainData["children"])
        //
        // for (let child of this.allDomainData["children"]) {
        //   if (child["children"] && child["children"].length) {
        //     child["totalChildren"] = child["children"].length
        //   }
        // }
      }

      //When user lands on domain type after selecting the OtherResource type
      if(this.getTopResource !== '' && this.getResource !== '' && !Object.keys(this.getSubject).length){
        console.log("ONLY OTHER RESOURCE")
        console.log("this.getResource::", this.getResource)
        this.resourceSelected = this.formatString(this.getResource)
        console.log("this.resourceSelected::", this.resourceSelected)

        //Using multiTagFilter query
        await this.fetchMultiTagsTerms([this.resourceSelected, null, null])

        let domainsArray = []
        for (let childLevelOne of this.domains) {
          for (let childLevelTwo of childLevelOne) {
            domainsArray.push(childLevelTwo)
          }
        }
        console.log("domainsArray::", domainsArray)
        await this.addRecordNumber(domainsArray)

        this.allDomainData["children"] = domainsArray
        this.countChildren(this.allDomainData)



        // //Using topDomains query instead variableFilter query because it is taking more
        // //than 30secs to get the content which is making the page unresponsive
        // await this.fetchTopDomainTerms(this.resourceSelected)
        // console.log("this.domainsType::", this.domainsType)
        // this.allDomainData["children"] = this.domainsType
        // for (let child of this.allDomainData["children"]) {
        //   if (child["children"] && child["children"].length) {
        //     child["totalChildren"] = child["children"].length
        //   }
        // }
      }

      //When user lands on domain type after selecting the TopResource & SubjectType type
      if(this.getTopResource !== '' && this.getResource === '' && Object.keys(this.getSubject).length){
        console.log("TOP RESOURCE & SUBJECT")

        if (this.getTopResource.toLowerCase() === 'database'){
          this.resourceSelected =  ["repository", "knowledgebase", "knowledgebase_and_repository"]
        }
        else if (this.getTopResource.toLowerCase() === 'standards') {
          this.resourceSelected =  ["model_and_format", "metric", "terminology_artefact", "reporting_guideline", "identifier_schema"]
        }
        else if (this.getTopResource.toLowerCase() === 'policies') {
          this.resourceSelected =  ["journal", "journal_publisher", "society", "funder", "project", "institution"]
        }

        this.subjectSelected = this.getSubject["name"].toLowerCase()
        console.log("this.resourceSelected::", this.resourceSelected)
        console.log("this.subjectSelected::", this.subjectSelected)
        //Using multiTagFilter query
        await this.fetchMultiTagsTerms([this.resourceSelected, this.subjectSelected, null])

        let domainsArray = []
        for (let childLevelOne of this.domains) {
          for (let childLevelTwo of childLevelOne) {
            domainsArray.push(childLevelTwo)
          }
        }
        console.log("domainsArray::", domainsArray)
        await this.addRecordNumber(domainsArray)

        this.allDomainData["children"] = domainsArray
        this.countChildren(this.allDomainData)
      }

      //When user lands on domain type after selecting the OtherResource & SubjectType type
      if(this.getTopResource !== '' && this.getResource !== '' && Object.keys(this.getSubject).length){
        console.log("OTHER RESOURCE & SUBJECT")
        this.resourceSelected = this.getResource.toLowerCase()
        this.subjectSelected = this.getSubject["name"].toLowerCase()
        console.log("this.resourceSelected::", this.resourceSelected)
        console.log("this.subjectSelected::", this.subjectSelected)
        //Using multiTagFilter query
        await this.fetchMultiTagsTerms([this.resourceSelected, this.subjectSelected, null])

        let domainsArray = []
        for (let childLevelOne of this.domains) {
          for (let childLevelTwo of childLevelOne) {
            domainsArray.push(childLevelTwo)
          }
        }
        console.log("domainsArray::", domainsArray)
        await this.addRecordNumber(domainsArray)

        this.allDomainData["children"] = domainsArray
        this.countChildren(this.allDomainData)
      }

      //When user lands on domain type after selecting SubjectType type
      if(this.getTopResource === '' && this.getResource === '' && Object.keys(this.getSubject).length){
        console.log("ONLY SUBJECT")
        this.subjectSelected = this.getSubject["name"].toLowerCase()
        console.log("this.subjectSelected::", this.subjectSelected)
        //Using variableFilter query
        await this.fetchVariableTags([null, this.subjectSelected, null, 'domain'])
        console.log("this.variableResponse::", this.variableResponse)
        this.allDomainData["children"] = this.variableResponse
        this.variableFilter = true
        for (let child of this.allDomainData["children"]) {
          if (child["children"] && child["children"].length) {
            child["totalChildren"] = child["children"].length
          }
        }
      }

      //Fetching the children from resourceType json data
      if(this.getTopResource === '' && this.getResource === '' && !Object.keys(this.getSubject).length && this.getDomain === "") {
        console.log("ALL DOMAINS")
        await this.fetchAllRecordTypes()
        this.allRecords = this.allRecordTypes["records"].map(({name}) => name)
        await this.fetchTopDomainTerms(this.allRecords)
        this.allDomainData["children"] = this.domainsType
        for (let child of this.allDomainData["children"]) {
          if (child["children"] && child["children"].length) {
            child["totalChildren"] = child["children"].length
          }
        }
      }
    },

    async addRecordNumber (array) {
      for (const item of array) {
        if(item["children"]?.length) {
          item["childrenNumber"] = item["children"].length
          const innerResult = await this.addRecordNumber(item["children"]);
          if (innerResult) return innerResult;
        }
      }
    },
    countChildren(domain) {
      domain["totalChildren"] = 0;
      if (domain["children"]?.length) {
        for (const child of domain["children"]){
          domain["totalChildren"] +=  this.countChildren(child);
        }
      }
      domain["totalChildren"] =  domain["childrenNumber"] ? domain["totalChildren"] + domain["childrenNumber"]: domain["totalChildren"];
      return domain["totalChildren"]
    },
    getCircles() {
      // Create root element
      let root = am5.Root.new(this.$refs.chartdiv);

      const canvas = this.$el.querySelector("canvas")
      canvasGetImageData(canvas)

      //To remove amcharts logo
      root._logo.dispose()

      // Set themes
      root.setThemes([am5themes_Animated.new(root)]);

      // Set data
      let data = this.allDomainData;
      // Create wrapper container
      let container = root.container.children.push(am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout
      }));
      // Create series
      let series = container.children.push(am5hierarchy.ForceDirected.new(root, {
        ariaLabel: "FAIRassist: Domain Type",
        singleBranchOnly: false,
        downDepth: 1,
        upDepth: 1,
        topDepth: 1,
        initialDepth: 0,
        valueField: "totalChildren",
        categoryField: "label",//Label displayed
        childDataField: "children",
        idField: "label",
        linkWithField: "linkWith",
        manyBodyStrength: -20,
        centerStrength: 0.8,
        minRadius: 10,
        // maxRadius: 90,
        // minRadius: am5.percent(2.5),
        maxRadius: am5.percent(20),
      }));

      if(this.variableFilter) {
        series.set("categoryField", "name");
      }

      if (!this.allDomainData["children"].length){
        series.set("topDepth", 0);
      }

      series.get("colors").setAll({
        step: 2
      });

      series.labels.template.setAll({
        fontSize: 20,
      });
      series.outerCircles.template.states.create("disabled", {
        fillOpacity: 0.1,
        strokeOpacity: 1,
        strokeDasharray: 3
      });

      // When a bubble is clicked
      series.nodes.template.events.on("click", (e) => {
        this.onBubbleSelection()
        const node = e.target.dataItem.dataContext
        let nodeName
        if (node["label"]) {
          nodeName = node["label"]
        } else {
          nodeName = node["name"]
        }
        if(this.itemClicked["name"] !== nodeName) {
          this.itemClicked = nodeName
          console.log("itemClicked::", this.itemClicked)
          this.$store.commit("bubbleSelectedStore/domainSelected", this.itemClicked)
        }
      });

      console.log("data::", data)
      series.links.template.set("strength", 0.5);
      series.data.setAll([data]);
      series.set("selectedDataItem", series.dataItems[0]);
      series.appear(1000, 100); // Make stuff animate on load

      // Add Breadcrumbs
      setTimeout(() => {
        breadCrumbBar(container, root, series)
      }, 300);
    }
  }
}
</script>

<style lang="scss" scoped>
.charts {
  width: 100%;
  height: 800px;
}
</style>

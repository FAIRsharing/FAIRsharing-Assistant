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
      id="subjectBubbleChart"
      ref="circlesDiv"
      class="charts"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"
import * as am5 from '@amcharts/amcharts5';
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { canvasGetImageData } from "@/utils/canvasRenderingContext"
import { breadCrumbBar } from "@/utils/breadCrumbBar";
import StringMixin from "@/utils/stringMixin.js"
import Loaders from "@/components/Loaders"

export default {
  name: 'SubjectType',
  components: { Loaders },
  mixins: [StringMixin],
  data:() => {
    return {
      loading: false,
      fairSharingButton: false,
      showSubjectSelected: false,
      resourceSelected: "" || [],
      domainSelected: "",
      allSubjectsData: {
        name: "Subject",
        value: 0,
        children: '',
      },
      topSubjects: [
        {
          id: 700,
          name: "Natural Science"
        },
        {
          id: 468,
          name: "Engineering Science"
        },
        {
          id: 613,
          name: "Humanities and Social Science",
        },
        {
          id: 768,
          name: "Subject Agnostic"
        }
      ],
      itemClicked: ""
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource','getResource','getSubject', 'getDomain']),
    ...mapState("recordTypeStore", ["allRecordTypes", "loadingData"]),
    ...mapState("variableTagStore", ["variableResponse", "loadingStatus"]),
    ...mapState("browseSubjectsStore", ["subjectBubbleTree", "loadingData"]),
    ...mapState("topSubjectStore", ["topSubjectBubbleTree", "loadingData"]),
  },
  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      await this.displaySubjects()
      await this.getCircles()
      this.loading = false
    })
  },
  destroyed() {
    this.leavePage()
    this.resetVariableTags()
    this.resetRecords()
  },
  methods: {
    ...mapActions("browseSubjectsStore", ["fetchTerms", "leavePage"]),
    ...mapActions("topSubjectStore", ["fetchTopSubjectTerms"]),
    ...mapActions("variableTagStore", ["fetchVariableTags", "resetVariableTags"]),
    ...mapActions("recordTypeStore", ["fetchAllRecordTypes", "resetRecords"]),

    onBubbleSelection() {
      this.fairSharingButton = true
      this.showSubjectSelected = true
      this.$emit('enableFairSharingButton', this.fairSharingButton)
      this.$emit('showSubjectSelected', this.showSubjectSelected)
    },
    topResource() {
      switch(this.getTopResource) {
      case "Standards":
        return "Standard"
      case "Policies":
        return "Policy"
      default:
        return this.getTopResource
      }
    },

    async recordTypes() {
      await this.fetchAllRecordTypes()
      this.allRecordTypes["records"].filter(({name, fairsharingRegistry}) =>{
        if (this.topResource() === fairsharingRegistry["name"]) {
          this.resourceSelected.push(name)
        }
      })
    },
    displayAllTopSubjects(subjects) {
      const fetchedSubjectNames = subjects.map(({ id }) => id)
      //All the selected resource
      const missingSubject = this.topSubjects.filter(({ id }) =>!fetchedSubjectNames.includes(id));
      if (missingSubject && missingSubject.length) {
        missingSubject.forEach((subject) => {
          this.allSubjectsData["children"].push(subject)
        })
      }
    },

    async calculateRecords(resourceSelected, subjectSelected, domainSelected, groupBy) {
      //Using variableFilter query
      await this.fetchVariableTags([resourceSelected, subjectSelected, domainSelected, groupBy])
      this.allSubjectsData["children"] = this.variableResponse
      this.displayAllTopSubjects(this.allSubjectsData["children"])
    },
    async displaySubjects() {
      //When user lands on subject type after selecting the TopResource & domainType type
      if(this.getTopResource !== '' && this.getResource === '' && this.getDomain !== ''){
        // eslint-disable-next-line no-console
        console.log("TOP RESOURCE & DOMAIN")
        await this.recordTypes()
        this.domainSelected = this.getDomain.toLowerCase()
        await this.calculateRecords(this.resourceSelected, null, this.domainSelected, "subject")
      }

      //When user lands on subject type after selecting the resource & domain type
      if (this.getResource !== '' && this.getDomain !== '') {
        // eslint-disable-next-line no-console
        console.log("OTHER RESOURCE & DOMAIN")
        this.resourceSelected = this.formatString(this.getResource)
        this.domainSelected = this.getDomain.toLowerCase()
        await this.calculateRecords(this.resourceSelected, null, this.domainSelected, "subject")
      }

      //When user lands on subject type after selecting the TOP Resource type
      if(this.getTopResource !== '' && this.getResource === '' && this.getDomain === '') {
        // eslint-disable-next-line no-console
        console.log("ONLY TOP RESOURCE")
        await this.recordTypes()
        await this.calculateRecords(this.resourceSelected, null, null, "subject")
      }
      //When user lands on subject type after selecting the resource type
      if(this.getResource !== '' && this.getDomain === '') {
        // eslint-disable-next-line no-console
        console.log("ONLY OTHER RESOURCE")
        this.resourceSelected = this.formatString(this.getResource)
        await this.calculateRecords(this.resourceSelected, null, null, "subject")
      }
      //When user lands on subject type after selecting the domain type
      if (this.getTopResource === '' && this.getResource === '' && this.getDomain !== ''){
        // eslint-disable-next-line no-console
        console.log("ONLY DOMAIN")
        this.domainSelected = this.getDomain.toLowerCase()
        await this.calculateRecords(null, null, this.domainSelected, "subject")
      }
      //When user lands on subject type as the entry point in the application
      if(this.getTopResource ==="" && this.getResource === '' && this.getDomain === '') {
        // eslint-disable-next-line no-console
        console.log("ALL SUBJECTS")
        await this.fetchTerms()
        this.allSubjectsData["children"] = this.subjectBubbleTree
      }
    },

    getCircles() {
      let data = this.allSubjectsData // Set data
      let root = am5.Root.new(this.$refs.circlesDiv); // Create root element
      const canvas = this.$el.querySelector("canvas")
      canvasGetImageData(canvas)
      root._logo.dispose() //To remove amcharts logo
      root.setThemes([am5themes_Animated.new(root)]); // Set themes
      // Create wrapper container
      let container = root.container.children.push(am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout
      }));

      // Create series
      let series = container.children.push(am5hierarchy.ForceDirected.new(root, {
        ariaLabel: "Subject Type",
        singleBranchOnly: false,
        downDepth: 1,
        upDepth: 1,
        topDepth: 1,
        initialDepth: 0,
        valueField: "records_count",
        categoryField: "name",//Label displayed
        childDataField: "children",
        idField: "name",
        linkWithField: "linkWith",
        manyBodyStrength: -20,
        centerStrength: 0.8,
        minRadius: 20,
        maxRadius: am5.percent(80),
      }));
      series.get("colors").setAll({
        step: 2
      });
      series.labels.template.set("fontSize", 20)
      series.outerCircles.template.states.create("disabled", {
        fillOpacity: 0.1,
        strokeOpacity: 1,
        strokeDasharray: 3
      });

      //When all four subjects have no records_count/records_count is 0 bubble size is same
      // const noChild = !this.allSubjectsData["children"].some((child) => {
      //   Object.hasOwn(child, "records_count")
      // })
      const noRecords = this.allSubjectsData["children"].every(({records_count}) => records_count === 0)
      if (noRecords) {
        series.setAll({
          minRadius: 100,
          maxRadius: 100
        });
      }
      // When a bubble is clicked
      series.nodes.template.events.on("click", (e) => {
        this.onBubbleSelection()
        const node = e.target.dataItem.dataContext
        if(this.itemClicked !== node["name"]) {
          this.itemClicked = node["name"]
          this.$store.commit("bubbleSelectedStore/subjectSelected", this.itemClicked)
        }
      });
      series.links.template.set("strength", 0.5)
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
  height: 700px;
}
</style>

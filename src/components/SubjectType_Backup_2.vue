<template>
  <div>

      <p v-if="resourceSelected">Resource Type Selected: {{resourceSelected}}</p>
    <p>Subject Type Selected: {{itemClicked}}</p>
      <div id="subjectBubbleChart" class="charts" ref="circlesDiv" />

    <v-fade-transition v-if="loading">
      <v-overlay
          :absolute="false"
          opacity="0.8"
      >
        <Loaders />
      </v-overlay>
    </v-fade-transition>
  </div>

</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"
import * as am5 from '@amcharts/amcharts5';
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import StringMixin from "@/utils/stringMixin.js"
import { canvasGetImageData } from "@/utils/canvasRenderingContext"
// import {database, policies, standards} from "@/data";
import Loaders from "@/components/Loaders"
// import {  browsesubject } from '@/data'

export default {
  name: 'SubjectType',
  components: { Loaders },
  mixins: [StringMixin],
  data:() => {
    return {
      loading: false,
      allSubjects: false,
      allSubjectsData: {
        children: '',
        records_count: 0
      },
      // policies: policies.data,
      // standards: standards.data,
      // database: database.data,
      // combinedData: [],
      topSubjects: ["Natural Science", "Humanities and Social Science", "Subject Agnostic", "Engineering Science"],
      itemClicked: ""
    }
  },
  props:[
    "resourceSelected",
  ],
  computed:{
    ...mapState("subjectStore", ["subjectBubbleTree", "loadingData"]),
    ...mapState("topSubjectStore", ["topSubjectBubbleTree", "loadingData"]),
    ...mapGetters("bubbleSelectedStore", ['getResource'])
  },
  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      // if(!this.loadingData) {
      //   if(this.resourceSelected) {

      if(this.getResource !== '') {
        console.log("this.getResource::", this.getResource)
          //When user lands on subject type after selecting resource type
          // const resourceTypeData = this.resourceSelected.toLowerCase().replaceAll
        //When user lands on subject type after selecting the resource type
        const resourceTypeData = this.formatString(this.getResource)
          await this.fetchTopSubjectTerms(resourceTypeData)
          this.allSubjectsData["children"] = this.topSubjectBubbleTree
          this.displayAllTopSubjects()
        }else {
          //When user lands on subject type as the entry point in the application
          await this.fetchTerms()
          this.allSubjects= true
          this.allSubjectsData["children"] = this.subjectBubbleTree
        }
      // }
      this.getCircles()
      this.loading = false

    })

  },
  // updated() {
  //   this.getCircles()
  // },
  methods: {
    ...mapActions("subjectStore", ["fetchTerms"]),
    ...mapActions("topSubjectStore", ["fetchTopSubjectTerms"]),

    displayAllTopSubjects() {

      const fetchedSubjectNames = this.topSubjectBubbleTree.map(({ label }) => label)

      //All the selected resource
      const missingSubject = this.topSubjects.filter( subject =>!fetchedSubjectNames.includes(subject));

      if (missingSubject && missingSubject.length) {
        missingSubject.forEach((subject) => {
          this.allSubjectsData["children"].push({"label" : subject})
        })
      }
    },
    // getData() {
    //   return this.combinedData = [...this.policies, ...this.standards, ...this.database]
    // },
    // reset(divId) {
    //   am5.array.each(am5.registry.rootElements, (root) => {
    //     if (root.dom.id !== '' && root.dom.id === divId) {
    //       root.dispose();
    //     }
    //   });
    // },
     getCircles() {
      let data // Set data

      // this.reset("subjectBubbleChart") //Reset chart
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
        focusable: true,
        ariaLabel: "FAIRassist: Subject Type",
        singleBranchOnly: true,
        downDepth: 1,
        upDepth: 1,
        topDepth: 1,
        initialDepth: 0,
        valueField: "records_count",
        //Update the name field to label field in topSubjects query to make all the bubble name in sync
        categoryField: "label",//Label displayed
        childDataField: "children",
        idField: "name",
        linkWithField: "linkWith",
        manyBodyStrength: -20,
        centerStrength: 0.8,
        minRadius: 60,
        // maxRadius: 90,
        // minRadius: am5.percent(5),
        maxRadius: am5.percent(10),
        xField: "x",
        yField: "y",
      }));

       if (this.allSubjects) {
         series.set("categoryField", "name");
       }

      series.get("colors").setAll({
        step: 8
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
         const itemName = e.target.dataItem.dataContext.name
         if( this.itemClicked !== itemName) {
           this.itemClicked = itemName
           // this.$emit('subjectTypeSelected', this.itemClicked);
           this.$store.commit("bubbleSelectedStore/subjectSelected", this.itemClicked)
         }
       });

      series.links.template.set("strength", 0.5)

       // if (this.resourceSelected) {
       //   let filteredData = this.getData().filter( obj => {
       //     return obj.name.toLowerCase().replaceAll(' ', '_') === this.resourceSelected.toLowerCase().replaceAll(' ', '_')
       //   })
       //   data = filteredData[0]
       // } else {
       //   data = this.allSubjectsData
       // }

      data = this.allSubjectsData
      series.data.setAll([data]);
      series.set("selectedDataItem", series.dataItems[0]);
      series.appear(1000, 100); // Make stuff animate on load

       // Add Breadcrumbs
       setTimeout(() => {
         container.children.unshift(
             am5hierarchy.BreadcrumbBar.new(root, {
               series: series
             }), 0
         );
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

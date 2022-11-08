<template>
  <div>

      <p v-if="resourceSelected">Resource Type Selected: {{resourceSelected}}</p>
    <p>Subject Type Selected: {{ itemClicked }}</p>
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
import Loaders from "@/components/Loaders"
import { breadCrumbBar } from "@/utils/breadCrumbBar";

export default {
  name: 'SubjectType',
  components: { Loaders },
  mixins: [StringMixin],
  data:() => {
    return {
      loading: false,
      allSubjects: false,
      allSubjectsData: {
        name: "Subject",
        value: 0,
        children: '',
        records_count: 0
      },
      topSubjects: ["Natural Science", "Humanities and Social Science", "Subject Agnostic", "Engineering Science"],
      itemClicked: "",
    }
  },
  props:[
    "resourceSelected",
  ],
  computed:{
    ...mapState("subjectStore", ["subjectBubbleTree", "loadingData"]),
    ...mapState("topSubjectStore", ["topSubjectBubbleTree", "loadingData"]),
    ...mapState("otherSubjectsStore", ["otherSubjectBubble", "loadingData"]),
    ...mapGetters("bubbleSelectedStore", ['getResource'])
  },
  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      await this.displaySubjects()
      this.getCircles()
      this.loading = false
    })
  },
  methods: {
    ...mapActions("subjectStore", ["fetchTerms"]),
    ...mapActions("topSubjectStore", ["fetchTopSubjectTerms"]),
    ...mapActions("otherSubjectsStore", ["fetchOtherSubject"]),

    async displaySubjects() {
      //When user lands on subject type after selecting the resource type
      if(this.getResource !== '') {
        console.log("Resource Selected::", this.getResource)
        const resourceTypeData = this.formatString(this.getResource)
        await this.fetchTopSubjectTerms(resourceTypeData)
        this.allSubjectsData["children"] = this.topSubjectBubbleTree
        this.displayAllTopSubjects()
        await this.fetchAllLevelSubjectData()

        //Update key "name" to "label" and assign value
        let { name: label, ...rest } = this.allSubjectsData;
        this.allSubjectsData = { label, ...rest }
        this.allSubjectsData["label"] = "Subject"
      }
      //When user lands on subject type as the entry point in the application
      else {
        await this.fetchTerms()
        this.allSubjects= true
        this.allSubjectsData["children"] = this.subjectBubbleTree
      }
    },

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

    async fetchAllLevelSubjectData() {
      const childrenLevelOne = this.allSubjectsData["children"]

      for (let i=0; i<childrenLevelOne.length; i++) {
        const childrenLevelTwo = childrenLevelOne[i]["children"]
        await this.getChildren(childrenLevelTwo)
        // if (childrenLevelTwo){
        //   for (let j=0; j< childrenLevelTwo.length; j++){
        //     const childId = childrenLevelTwo[j]["id"]
        //
        //     await this.fetchOtherSubject([childId, this.formatString(this.getResource)])
        //     if (this.otherSubjectBubble[0] && this.otherSubjectBubble[0]["children"] && this.otherSubjectBubble[0]["children"].length){
        //       childrenLevelTwo[j]["children"] = this.otherSubjectBubble[0]["children"]
        //     }
        //   }
        // }
      }
    },


    async getChildren(arr) {
      if (arr) {
        for (let j=0; j< arr.length; j++){
          const childId = arr[j]["id"]
          await this.fetchOtherSubject([childId, this.formatString(this.getResource)])
          if (this.otherSubjectBubble[0] && this.otherSubjectBubble[0]["children"] && this.otherSubjectBubble[0]["children"].length){
            arr[j]["children"] = this.otherSubjectBubble[0]["children"]
            console.log("arr[j][\"label\"]::", arr[j]["label"])
            console.log("arr[j][\"children\"]::", arr[j]["children"])
            await this.getChildren(arr[j]["children"])
          } else {
            return
          }
        }
        }
      },


      // arr.forEach(subArr => {
      //   if (subArr["children"] && subArr["children"].length) {
      //     this.getChildren(subArr["children"])
      //   } else {
      //     console.log("subArr.id::", subArr["id"])
      //     console.log("subArr::", subArr)
      //     return subArr["id"]
      //   }
      // })
    // },

    getCircles() {
      let data // Set data
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

      series.links.template.set("strength", 0.5)
      data = this.allSubjectsData



       // When a bubble is clicked
       series.nodes.template.events.on("click", (e) => {
         // const basicSubjectTypes = ['Natural Science', 'Engineering Science', 'Subject Agnostic', 'Humanities and Social Science'];
         const node = e.target.dataItem.dataContext
         let nodeName
         if (node["label"]) {
           nodeName = node["label"]
           console.log("nodeName::", nodeName)
           console.log("nodeId::", node["id"])
         } else {
           nodeName = node["name"]
         }
         if( this.itemClicked !== nodeName) {
           this.itemClicked = nodeName
           console.log("itemClicked::", this.itemClicked)
           this.$store.commit("bubbleSelectedStore/subjectSelected", this.itemClicked)
           }
       });

      console.log("data::", data)
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

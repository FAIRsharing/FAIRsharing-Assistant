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

      <p v-if="getResource">Resource Type Selected: {{getResource}}</p>
      <p>Subject Type Selected: {{ itemClicked["name"] }}</p>
      <div id="subjectBubbleChart" class="charts" ref="circlesDiv" />


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
      browseSubjects: false,
      allSubjectsData: {
        name: "Subject",
        value: 0,
        children: '',
        descendants_count: 0
      },
      topSubjects: ["Natural Science", "Humanities and Social Science", "Subject Agnostic", "Engineering Science"],
      itemClicked: {
        id: '',
        name: ''
      },
    }
  },
  computed:{
    ...mapState("browseSubjectsStore", ["subjectBubbleTree", "loadingData"]),
    ...mapState("topSubjectStore", ["topSubjectBubbleTree", "loadingData"]),
    ...mapState("otherSubjectsStore", ["otherSubjectBubble", "loadingStatus"]),
    ...mapGetters("otherSubjectsStore", ['loadingStatus']),
    ...mapGetters("bubbleSelectedStore", ['getResource'])
  },

  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      await this.displaySubjects()
      await this.getCircles()
      this.loading = false
    })
  },
  methods: {
    ...mapActions("browseSubjectsStore", ["fetchTerms"]),
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
        this.browseSubjects= true
        await this.fetchTerms()
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

    // Create an array of ids. Change the fetchRecordTypes method to consume a list of ids instead of single id

    //Single id is passed as argument in the fetchRequest resulting more graphQL calls
    // async getChildren(arr) {
    //   if (arr && arr.length) {
    //     for (let j=0; j< arr.length; j++){
    //       const childId = arr[j]["id"]
    //       await this.fetchOtherSubject([childId, this.formatString(this.getResource)])
    //       if (this.otherSubjectBubble[0] && this.otherSubjectBubble[0]["children"] && this.otherSubjectBubble[0]["children"].length){
    //         arr[j]["children"] = this.otherSubjectBubble[0]["children"]
    //         arr[j]["descendants_count"] = this.otherSubjectBubble[0]["children"].length
    //         await this.getChildren(arr[j]["children"])
    //       }
    //     }
    //   }
    // },

    //Array of ids are passed as arguments in the fetchRequest resulting lesser graphQL calls
    async getChildren(arr) {
      if (arr && arr.length) {
        const arrIds = arr.map(({id}) => id)
        await this.fetchOtherSubject([arrIds, this.formatString(this.getResource)])
        const response  = this.otherSubjectBubble
        if (response && response.length) {
          arr.filter(async subItem => {
            const matchedData = response.find(ele => ele.id === subItem.id)
            if (matchedData !== undefined && matchedData.id === subItem.id && matchedData["children"] && matchedData["children"].length) {
              subItem["children"] = matchedData["children"]
              console.log("matchedData[\"label\"].::", matchedData["label"])
              subItem["descendants_count"] = matchedData["children"].length
              await this.getChildren(subItem["children"])
            }
          })
        }
      }
    },

    countChildren(subject) {
      subject["totalChildren"] = 0;
      if (subject["children"] && subject["children"].length) {
        for (const child of subject["children"]){
          subject["totalChildren"] += this.countChildren(child);
        }
      }
      subject["totalChildren"] = subject["descendants_count"] ? subject["totalChildren"] + subject["descendants_count"] : subject["totalChildren"]
      return subject["totalChildren"];
    },

    async fetchAllLevelSubjectData() {
      const childrenLevelOne = this.allSubjectsData["children"]
      // for (const child of childrenLevelOne) {
      //   const childrenLevelTwo = child["children"]
      //   await this.getChildren(childrenLevelTwo)
      // }

      //Optimised performance
      console.log("LOOP STARTS")
      await Promise.all(childrenLevelOne.map(async ({ children }) => {
        await this.getChildren(children)
      }));
      this.countChildren(this.allSubjectsData)
      console.log("LOOP ENDS")
    },

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
        ariaLabel: "FAIRassist: Subject Type",
        singleBranchOnly: true,
        downDepth: 1,
        upDepth: 1,
        topDepth: 1,
        initialDepth: 0,
        valueField: "totalChildren",
        //Update the name field to label field in topSubjects query to make all the bubble name in sync
        categoryField: "label",//Label displayed
        childDataField: "children",
        idField: "name",
        linkWithField: "linkWith",
        manyBodyStrength: -20,
        centerStrength: 0.8,
        minRadius: 60,
        // maxRadius: 200,
        // minRadius: am5.percent(5),
        maxRadius: am5.percent(20),
        // maxRadius: am5.percent(8),
        // xField: "x",
        // yField: "y",
      }));

       if (this.browseSubjects) {
         series.setAll({
           categoryField: "name",
           valueField: "descendants_count"
         });
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

       //When all four subjects have no children bubble size is same
       const noChild = this.allSubjectsData["children"].every(({totalChildren}) => totalChildren === 0 )
       if (noChild) {
         series.setAll({
           minRadius: 100,
           maxRadius: 100
         });
       }
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
           console.log("nodeName::", nodeName)
           console.log("nodeId::", node["id"])
         }
         if( this.itemClicked["name"] !== nodeName) {
           this.itemClicked["id"] = node["id"]
           this.itemClicked["name"] = nodeName
           console.log("itemClicked::", this.itemClicked["name"])
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

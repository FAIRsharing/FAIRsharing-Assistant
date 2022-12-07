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
    <div id="subjectBubbleChart" class="charts" ref="circlesDiv" />
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
//Temporary
// import { resourcetype } from '@/data'

export default {
  name: 'SubjectType',
  components: { Loaders },
  mixins: [StringMixin],
  data:() => {
    return {
      loading: false,
      fairSharingButton: false,
      browseSubjects: false,
      variableFilter: false,
      resourceSelected: null,
      domainSelected: null,
      allSubjectsData: {
        name: "Subject",
        value: 0,
        children: '',
        records_count: 0
      },
      topSubjects: [
        {
          id: 700,
          label: "Natural Science",
          name: "Natural Science"
        },
        {
          id: 468,
          label: "Engineering Science",
          name: "Engineering Science"
        },
        {
          id: 613,
          label: "Humanities and Social Science",
          name: "Humanities and Social Science",
        },
        {
          id: 768,
          label: "Subject Agnostic",
          name: "Subject Agnostic"
        }
      ],
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
    ...mapState("subjectStore", ["subjectRecords", "loadingData"]),
    ...mapState("multiTagsStore", ["result", "subjects", "loadingStatus"]),
    ...mapState("variableTagStore", ["variableResponse", "loadingStatus"]),
    ...mapGetters("otherSubjectsStore", ['loadingStatus']),
    ...mapGetters("bubbleSelectedStore", ['getResource','getSubject', 'getDomain']),
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
  },
  methods: {
    ...mapActions("browseSubjectsStore", ["fetchTerms", "leavePage"]),
    ...mapActions("topSubjectStore", ["fetchTopSubjectTerms"]),
    ...mapActions("otherSubjectsStore", ["fetchOtherSubject"]),
    ...mapActions("multiTagsStore", ["fetchMultiTagsTerms"]),
    ...mapActions("variableTagStore", ["fetchVariableTags"]),
    //Temperary
    ...mapActions("subjectStore", ["fetchSubjectRecords"]),


    onBubbleSelection() {
      this.fairSharingButton = true
      this.$emit('enableFairSharingButton', this.fairSharingButton)
    },

    async displaySubjects() {

      //When user lands on subject type after selecting the resource & domain type
     if (this.getResource !== '' && this.getDomain !== '') {
       console.log("BOTH")
        //Temporary
        // this.allSubjectsData = resourcetype
       this.resourceSelected = this.getResource.toLowerCase()
       this.domainSelected = this.getDomain.toLowerCase()

        //Using variableFilter query
        await this.fetchVariableTags([this.resourceSelected, null, this.domainSelected, 'subject'])
        console.log("variableResponse::", this.variableResponse)
        await this.addRecordNumber(this.variableResponse)
        this.variableFilter = true
        this.allSubjectsData["children"] = this.variableResponse
        this.countRecords(this.allSubjectsData)
        this.allSubjectsData = this.filterNoRecordSubject(this.allSubjectsData)
        this.displayAllTopSubjects(this.allSubjectsData["children"])
    }

      //When user lands on subject type after selecting the resource type
      if(this.getResource !== '' && this.getDomain === '') {
        console.log("ONLY RESOURCE")
        this.resourceSelected = this.formatString(this.getResource)
        const resourceTypeData = this.resourceSelected
        await this.fetchTopSubjectTerms(resourceTypeData)
        this.allSubjectsData["children"] = this.topSubjectBubbleTree
        this.displayAllTopSubjects(this.topSubjectBubbleTree)
        await this.fetchAllLevelSubjectData()
        //Update key "name" to "label" and assign value
        let { name: label, ...rest } = this.allSubjectsData;
        this.allSubjectsData = { label, ...rest }
        this.allSubjectsData["label"] = "Subject"
      }
      //When user lands on subject type after selecting the domain type
        if (this.getResource === '' && this.getDomain !== ''){
          console.log("ONLY DOMAIN")
        this.domainSelected = this.getDomain.toLowerCase()

        //Using variableFilter query
        await this.fetchVariableTags([null, null, this.domainSelected, 'subject'])
        console.log("variableResponse::", this.variableResponse)
        await this.addRecordNumber(this.variableResponse)
        this.variableFilter = true
        this.allSubjectsData["children"] = this.variableResponse
        this.countRecords(this.allSubjectsData)
        this.allSubjectsData = this.filterNoRecordSubject(this.allSubjectsData)
        this.displayAllTopSubjects(this.allSubjectsData["children"])



        //Using multiTagFilter query
        // await this.fetchMultiTagsTerms([null, null, this.domainSelected])
        //
        // // console.log("subjects::", this.subjects)
        // // const uniqueArray = Array.from(new Set(this.subjects.map(JSON.stringify)), JSON.parse);
        // // console.log("uniqueArray::", uniqueArray)
        //
        // let subjectsArray = []
        // for (let childLevelOne of this.subjects) {
        //   for (let childLevelTwo of childLevelOne) {
        //     subjectsArray.push(childLevelTwo)
        //   }
        // }
        // // console.log("subjectsArray::", subjectsArray)
        // const ids = subjectsArray.map(({id}) => id)
        // const uniqueSubjectsArray = subjectsArray.filter(({id}, index) => !ids.includes(id, index + 1))
        //
        // // console.log("uniqueSubjectsArray::", uniqueSubjectsArray)
        //
        // uniqueSubjectsArray.map((ele) => {
        //   if (ele["children"] && ele["children"].length)
        //     ele["totalChildren"] = ele["children"].length
        // })
        // this.allSubjectsData["children"] = uniqueSubjectsArray
        //
        // let { name: label, ...rest } = this.allSubjectsData;
        // this.allSubjectsData = { label, ...rest }
        // this.allSubjectsData["label"] = "Subject"

        // // let combinedSubjectArray = []
        // for (let subject of uniqueSubjectsArray) {
        //   // let newLevels = {
        //   //   item: '',
        //   //   children: {}
        //   // }
        //   let filteredChildren = []
        //   if (subject["children"]?.length) {
        //     for (let child of subject["children"]) {
        //       let lostChild = await this.findItem(uniqueSubjectsArray, child["label"])
        //       if (lostChild !== undefined) {
        //         console.log("subject[label]::", subject["label"])
        //         console.log("child::", child["label"])
        //         console.log("subject[\"children\"]::", subject["children"])
        //         const lostChild = await this.findItem(uniqueSubjectsArray, child["label"])
        //         console.log("lostChild::", lostChild)
        //         filteredChildren = subject["children"].filter(childItem =>
        //           childItem["label"] !== child["label"]
        //         )
        //         filteredChildren.push(lostChild)
        //         console.log("filteredChildren::", filteredChildren)
        //       }
        //     }
        //   }
        // }


        // await this.fetchTerms()
        // console.log("subjectBubbleTree::", this.subjectBubbleTree)
        // console.log("getFlatSubjectBubbleTree::", this.getFlatSubjectBubbleTree(this.subjectBubbleTree))
        // const findSubjectByID = await this.findById(this.subjectBubbleTree, 596)
        // console.log("findSubjectByID::", await findSubjectByID)



        // await this.fetchSubjectRecords(842)
        // console.log("this.subjectRecords::", this.subjectRecords)
        // const hierarchy = this.hierarchy(uniqueSubjectsArray);
        // console.log("hierarchy::", hierarchy)


      }
      //When user lands on subject type as the entry point in the application
      if(this.getResource === '' && this.getDomain === '') {
        console.log("ALL SUBJECTS")
        this.browseSubjects= true
        await this.fetchTerms()
        this.allSubjectsData["children"] = this.subjectBubbleTree
      }
    },

   // hierarchy (data) {
   //   const tree = [];
   //   const childOf = {};
   //   data.forEach((item) => {
   //     // const { id, parents } = item;
   //     const id  = item["id"]
   //     const parents  = item["parents"][0]["label"]
   //     // console.log("id::", id)
   //     // console.log("parents::", parents)
   //     childOf[id] = childOf[id] || [];
   //     console.log("childOf['id']::", childOf[id])
   //     item.children = childOf[id];
   //     console.log("item.children::", item.children)
   //     parents ? (childOf[parents] = childOf[parents] || []).push(item) : tree.push(item);
   //   });
   //   return tree;
   //  },

     filterNoRecordSubject(subject) {
      const filteredSubTasks = subject["children"]
          .filter( item => item["totalChildren"] > 0)
          .map( item =>  this.filterNoRecordSubject(item))
      return {
        ...subject,
        children: filteredSubTasks
      }


      //     array.filter(async (item) => {
      //   if(item["totalChildren"] > 0 ) {
      //     console.log("item::", item["name"])
      //     if(item["children"]?.length) {
      //       await this.filterNoRecordSubject(item["children"]);
      //     }
      //   }
      // })

    },


    async addRecordNumber (array) {
      for (const item of array) {
        if (item["fairsharing_records"] && item["fairsharing_records"].length) {
          item["totalRecords"] = item["fairsharing_records"].length
        }
        if(item["children"]?.length) {
          const innerResult = await this.addRecordNumber(item["children"]);
          if (innerResult) return innerResult;
        }
      }
    },

    // async findItem (array, label) {
    //   for (const item of array) {
    //     if (item["label"] === label) return item;
    //   }
    // },
    //Find the subject from browseSubject response
    // async findItem (array, id) {
    //   for (const item of array) {
    //     if (item.id === id) return item;
    //     if (item.children?.length) {
    //       const innerResult = await this.findItem(item.children, id);
    //       if (innerResult) return innerResult;
    //     }
    //   }
    // },

     // async findById(array, id) {
     //
     //   console.log("findItemInBrowseSubjectArray::", await this.findItemInBrowseSubjectArray(array, id))

      // array.filter(async (item) =>{
      // // for (const item of array) {
      //   if (item.id === id) {
      //     // return item;
      //     await this.fetchSubjectRecords(item.id)
      //     console.log("this.subjectRecords::", this.subjectRecords)
      //     if (this.subjectRecords["parents"]?.length) {
      //       for (const parent of this.subjectRecords["parents"]) {
      //         console.log("parent::", parent["label"])
      //         await this.fetchSubjectRecords(parent["id"])
      //         console.log("this.subjectRecords::", this.subjectRecords)
      //       }
      //     }
      //     return  array.filter((item) => item.id === id)
      //   }
      //   if (item["children"]?.length) {
      //     const innerResult = await this.findById(item["children"], id);
      //     if (innerResult) {
      //       return innerResult;
      //     }
      //   }
      //   })
    // },


    // getFlatSubjectBubbleTree(members) {
    //   let children = [];
    //   return members.map(m => {
    //     if (m.children && m.children.length) {
    //       children = [...children, ...m.children];
    //     }
    //     return m;
    //   }).concat(children.length ? this.getFlatSubjectBubbleTree(children) : children);
    // },

    // displayAllTopSubjects(subjects) {
    //   // const fetchedSubjectNames = subjects.map(({ label }) => label)
    //   const fetchedSubjectNames = subjects.map((subject) => {
    //     if (subject["label"]) return subject["label"]
    //     else return subject["name"]
    //   })
    //   //All the selected resource
    //   const missingSubject = this.topSubjects.filter( ({ label }) =>!fetchedSubjectNames.includes(label));
    //   if (missingSubject && missingSubject.length) {
    //     missingSubject.forEach((subject) => {
    //       this.allSubjectsData["children"].push(subject)
    //     })
    //   }
    // },

    displayAllTopSubjects(subjects) {
      const fetchedSubjectNames = subjects.map(({ id }) => id)
      //All the selected resource
      const missingSubject = this.topSubjects.filter( ({ id }) =>!fetchedSubjectNames.includes(id));
      if (missingSubject && missingSubject.length) {
        missingSubject.forEach((subject) => {
          this.allSubjectsData["children"].push(subject)
        })
      }
    },

    // Create an array of ids. Change the fetchRecordTypes method to consume a list of ids instead of single id

    //Single id is passed as argument in the fetchRequest resulting more graphQL calls
    // async getChildren(arr) {
    //   if (arr && arr.length) {
    //     for (let j=0; j< arr.length; j++){
    //       const childId = arr[j]["id"]
    //       await this.fetchOtherSubject([childId, this.formatString(this.resourceSelected)])
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

        await this.fetchOtherSubject([arrIds, this.resourceSelected])
        const response  = this.otherSubjectBubble

        if (response && response.length) {
          let nextReqIds = []

          arr.filter(async subItem => {
            const matchedData = response.find(ele => ele.id === subItem.id)
            if (matchedData !== undefined && matchedData.id === subItem.id && matchedData["children"] && matchedData["children"].length) {
              subItem["children"] = matchedData["children"]
              console.log("Subject Label::", matchedData["label"])
              subItem["records_count"] = matchedData["children"].length
              nextReqIds = [...subItem["children"], ...nextReqIds]
            }
          })
          await this.getChildren(nextReqIds)
        }
      }
    },

    countRecords(subject) {
      subject["totalChildren"] = 0;
      for (const child of subject["children"]){
        subject["totalChildren"] +=  this.countRecords(child);
      }
      subject["totalChildren"] =  subject["totalRecords"] ? subject["totalChildren"] + subject["totalRecords"]: subject["totalChildren"];
      return subject["totalChildren"]
    },

    countChildren(subject) {
      subject["totalChildren"] = 0;
      if (subject["children"]?.length) {
        for (const child of subject["children"]){
          subject["totalChildren"] += this.countChildren(child);
        }
      }
      subject["totalChildren"] = subject["records_count"] ? subject["totalChildren"] + subject["records_count"] : subject["totalChildren"]
      return subject["totalChildren"];
    },

    async fetchAllLevelSubjectData() {
      const childrenLevelOne = this.allSubjectsData["children"]
      console.log("LOOP STARTS")
      // for (const child of childrenLevelOne) {
      //   const childrenLevelTwo = child["children"]
      //   await this.getChildren(childrenLevelTwo)
      // }
      //Optimised performance
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
        minRadius: 20,
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
          valueField: "records_count"
        });
      }
      if(this.variableFilter) {
        series.setAll({
          categoryField: "name",
          minRadius: 20,
          maxRadius: am5.percent(15),
        });
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
        this.onBubbleSelection()
        const node = e.target.dataItem.dataContext
        let nodeName
        if (node["label"]) {
          nodeName = node["label"]
        } else {
          nodeName = node["name"]
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

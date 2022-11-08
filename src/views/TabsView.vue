<template>
    <v-card flat>
      <v-toolbar
          flat
          color="primary"
          dark
      >
        <v-toolbar-title>FAIRassist</v-toolbar-title>
      </v-toolbar>
      <v-tabs vertical>
        <v-tab to="/resource">
          <v-icon left>
            mdi-account
          </v-icon>
          Resource Type
        </v-tab>
        <v-tab to="/subject">
          <v-icon left>
            mdi-lock
          </v-icon>
          Subject
        </v-tab>
        <v-tab>
          <v-icon left>
            mdi-access-point
          </v-icon>
          Domain
        </v-tab>

        <v-tab-item>
<!--          <v-card flat>-->
<!--            <ResourceTypeView @resourceTypeSelected="resourceBubbleSelected"/>-->
<!--          </v-card>-->
          <v-card flat>
            <ResourceTypeView />
          </v-card>
        </v-tab-item>
        <v-tab-item>
<!--          <v-card flat>-->
<!--            <SubjectType :resourceSelected="resourceSelected" @subjectTypeSelected="subjectBubbleSelected"/>-->
<!--          </v-card>-->
          <v-card flat>
            <SubjectTypeView/>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <p>
                Domain
              </p>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>

</template>

<script>

import ResourceTypeView from "./Resource/ResourceTypeView";
import SubjectTypeView from "./Subject/SubjectTypeView";
// import SunBurst from "@/components/SunBurst";
export default {
  name: "TabsView",
  data() {
    return {
        resourceSelected: "",
        subjectSelected: ""
      }
  },
  components: {
    ResourceTypeView,
    SubjectTypeView,
    // SunBurst
  },
  methods: {
    resourceBubbleSelected(item) {
      this.resourceSelected = item
    },
    subjectBubbleSelected(item) {
      console.log("Subject item::", item)
      this.subjectSelected = item
    }
  }
};
</script>

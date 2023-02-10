<template>
  <div>
    <Jumbotron />
    <div class="px-md-10 pa-5 mb-8">
      <Selection />
      <FairSharingLink
        :fair-sharing-button="fairSharingButton"
      />
      <StartOver />
      <SubjectButton />
      <RecordsTable
        v-if="getResource"
        :get-all-resources="getAllResources"
      />
      <AddOnFilters />
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import FairSharingLink from "@/components/Navigation/FairSharingLink";
import StartOver from "@/components/Navigation/StartOver";
import Jumbotron from "@/components/Navigation/Jumbotron";
import SubjectButton from "@/components/Navigation/SubjectButton";
import RecordsTable from "@/components/Others/RecordsTable"
import AddOnFilters from "@/components/Others/AddOnFilters.vue";
import Selection from "@/components/Others/Selection";

export default {
  name: 'RefineView',
  components: {
    FairSharingLink,
    Jumbotron,
    StartOver,
    SubjectButton,
    RecordsTable,
    AddOnFilters,
    Selection,
  },
  data:() => {
    return {
      fairSharingButton: true,
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getAllResources', 'getTopResource', 'getResource', 'getSubject', 'getDomain']),
  },
};
</script>


import {mapActions, mapState} from "vuex";

const allSubjectsData = {
  name: "Subject",
  value: 0,
  children: '',
}
const allDomainData = {
  name: "Domain",
  value: 0,
  children: "",
}

const topSubjects = [
  {
    id: 700,
    name: "Natural Science",
    records_count: 0
  },
  {
    id: 468,
    name: "Engineering Science",
    records_count: 0
  },
  {
    id: 613,
    name: "Humanities and Social Science",
    records_count: 0
  },
  {
    id: 768,
    name: "Subject Agnostic",
    records_count: 0
  }
]

const calculateRecords = {

  computed: {
    ...mapState("variableTagStore", ["variableResponse", "loadingStatus"]),
  },
  methods: {
    ...mapActions("variableTagStore", ["fetchVariableTags", "resetVariableTags"]),
    /**
     *
     * @param {Array} Subjects - Subjects array
     * @returns {Object} - All four subjects i.e. Engineering Science, Natural Science, Subject Agnostic, Humanities And Social Science with
     */
    displayAllTopSubjects(subjects) {
      const fetchedSubjectNames = subjects.map(({ id }) => id)
      //All the selected resource
      const missingSubject = topSubjects.filter(({ id }) =>!fetchedSubjectNames.includes(id));
      if (missingSubject && missingSubject.length) {
        missingSubject.forEach((subject) => {
          allSubjectsData["children"].push(subject)
        })
      }
      return allSubjectsData
    },
    /**
     *
     * @param {String} resourceSelected - The resource selected
     * @param {String} subjectSelected - The subject selected
     * @param {String} domainSelected - The domain selected
     * @param {String} groupBy - group by Subject/Domain
     * @param addonfilters - adding more filters
     * @returns {Object} - All Subjects Data
     */
    async calculateRecords(resourceSelected, subjectSelected, domainSelected, groupBy, addonfilters) {
      let result
      //Using variableFilter query
      await this.fetchVariableTags([resourceSelected, subjectSelected, domainSelected, groupBy, addonfilters])
      if (groupBy === "subject") {
        allSubjectsData["children"] = this.variableResponse
        result = this.displayAllTopSubjects(allSubjectsData["children"])
      }
      else if(groupBy === "domain"){
        allDomainData["children"] = this.variableResponse
        result = allDomainData
      }
      return result
    },
  }
}

export default calculateRecords;
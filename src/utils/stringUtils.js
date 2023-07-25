const stringUtils  = {
  methods: {
    formatString(name){
      return name.replace(/\s/g, '_').toLowerCase()
    },
    normalString(name){
      return name.replace(/\b\w/, (c) => c.toUpperCase()).replace(/_/g, " ")
    }
  }
}

export default stringUtils;
export default {
  methods: {
    formatString(name){
      return name.replace(/\s/g, '_').toLowerCase()
    },
    normalString(name){
      if (name !== undefined) return name.replace(/\b\w/, (c) => c.toUpperCase()).replace(/_/g, " ")
    }
  }
}
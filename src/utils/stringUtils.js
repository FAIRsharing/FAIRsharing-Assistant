const stringUtils  = {
  methods: {
    formatString(name){
      return name.replace(/\s/g, '_').toLowerCase()
    },
    normalString(name){
      return name.replace(/\b\w/, (c) => c.toUpperCase()).replace(/_/g, " ")
    },
    capitaliseText(text, type) {
      if (type === 'taxonomy') {
        // Upper case for first character only.
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      }
      else {
        // Upper case for first letter of each word.
        return text.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
      }
    },
    humaniseKey(key) {
      let split = key.replace(/([A-Z])/g, " $1").toLowerCase();
      return split.charAt(0).toUpperCase() + split.slice(1).toLowerCase();
    }
  }
}

export default stringUtils;
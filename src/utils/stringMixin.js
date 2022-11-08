export default {
    methods: {
        formatString(name){
            return name.replace(/\s/g, '_').toLowerCase()
        }
    }
}
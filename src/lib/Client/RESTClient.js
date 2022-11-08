import axios from "axios"

class RESTClient {

    /**
     * The RESTClient is a singleton class that handles the connection and data exchange from the back-end
     * REST API.
     */
    constructor(){
        if (RESTClient._instance){
            return RESTClient._instance
        }
        RESTClient._instance = this;
        this.baseURL = process.env.VUE_APP_API_ENDPOINT;
        this.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        };
        this.headers['X-Client-Id'] = process.env.VUE_APP_CLIENT_ID;
    }

    /**
     * Trigger the given query with Axios
     * @param query
     * @returns {Promise<*>}
     */
    async executeQuery(query) {
        try {
            return await axios(query);
        }
        catch(e){
            return({data: {error: e}});
        }
    }

    /**
     * Get records data
     * @returns {Promise}
     */
    async getRecordsData(){
        let _client = this;
        const request = {
            method: "get",
            baseURL: _client.baseURL + "/record_types",
        };
        let response = await _client.executeQuery(request);
        return response.data;
    }

}

export default RESTClient;
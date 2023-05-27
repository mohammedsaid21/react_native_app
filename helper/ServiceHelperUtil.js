import axios from 'axios'

//const BASE_URL = 'http://localhost:8080/ghalban-backend';
//const BASE_URL
// const BASE_URL = "http://ahmed-tayeh.com/ghalban-backend";
const BASE_URL = "https://ahmed-tayeh.com/ghalban-backend-test";

class ServiceHelperUtil{

    getBaseURL(){
        return BASE_URL;
    }

    
}

export default new ServiceHelperUtil();
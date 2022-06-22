import CommonUtil from "../../common/common";
import { callApi } from "../interface";

class jiraClient {
    constructor(param) {
        this.url = process.env.REACT_APP_PROXY_URL + process.env.REACT_APP_JIRA_URL;
        this.header = {
            Authorization: 'Basic ' + param.auth,
            'Content-type': 'application/json'
        }
    }

    history = async (data) => {
        const url = this.url + CommonUtil.RestJiraSearchUrl;

        let getList = await callApi(
    'GET',
            url,
            {
                "jql":CommonUtil.JiraSearchQuerystring('NGCPO', data), "maxResults":200
            },
            this.header
        );

        return getList;
    }
}

export default jiraClient;
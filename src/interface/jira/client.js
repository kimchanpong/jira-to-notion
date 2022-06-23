import CommonUtil from "../../util/common";
import { callApi } from "../common/interface";

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

        return getList['issues'];
    }
}

export default jiraClient;
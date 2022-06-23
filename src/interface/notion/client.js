import CommonUtil from "../../util/common";
import {callApi} from "../common/interface";

class NotionClient {
    constructor(param) {
        this.url = process.env.REACT_APP_PROXY_URL + process.env.REACT_APP_NOTION_URL;
        this.header = {
            Authorization: 'Bearer ' + param.auth,
            Accept: 'application/json',
            'Notion-Version': '2022-02-22',
            'Content-Type': 'application/json',
        }
    }

    search = async (param) => {
        const url = this.url + CommonUtil.RestNotionSearchUrl;

        let resultList = await callApi(
    'POST',
            url,
            param,
     {
                headers: this.header
            }
        );

        return resultList;
    }

    query = async (param) => {
        const url = this.url + CommonUtil.RestNotionDatabasesUrl(param.id);

        const result = await callApi(
    'POST',
            url,
    {},
            {
                headers: this.header
            }
        )

        return result;
    }

    pageUpdate = async (param) => {
        const url = this.url + CommonUtil.RestNotionPagesUrl(`/${param.id}`);

        let response = await callApi(
    'PATCH',
            url,
            {
                properties: param.properties
            },
            {
                headers: this.header
            }
        );

        return response;
    }

    pageCreate = async (param) => {
        const url = this.url + CommonUtil.RestNotionPagesUrl();

        let response = await callApi(
    'POST',
            url,
    {
                parent: param.parent,
                properties: param.properties,
                // children: jira.getChildren()
            },
            {
                headers: this.header
            }
        );

        return response;
    }
}

export default NotionClient;
import axios from "axios";
import CommonUtil from "../common/common";
import jiraDto from "../component/jiraDto";

let notion;

async function callGet(url, params, header) {
    const response = await axios.get(url, {
            params: params,
            headers: header
        }
    );

    return response.data;
}

async function callPost(url, params, header) {
    const response = await axios.post(url, params, header);

    return response.data;
}

async function callPatch(url, params, header) {
    const response = await axios.patch(url, params, header);

    return response.data;
}

async function callApi(method, url, params, header) {
    let result;
    if(method === 'GET') {
        result = callGet(url, params, header);
    } else if(method === 'POST') {
        result = callPost(url, params, header);
    } else if(method === 'PATCH') {
        result = callPatch(url, params, header);
    }

    return result;
}

async function getHistory(data) {
    const proxyUrl = process.env.REACT_APP_PROXY_URL;
    const jiraUrl = process.env.REACT_APP_JIRA_URL;
    const url = proxyUrl + jiraUrl + CommonUtil.RestSearchUrl;

    let getList = await callApi(
        'GET',
                url,
        {
                    "jql":CommonUtil.SearchQuerystring('NGCPO', data), "maxResults":200
                },
        {
                    Authorization: 'Basic ' + process.env.REACT_APP_AUTHORIZATION_TOKEN,
                    'Content-type': 'application/json'
                }
    );

    const mergeList = getList['issues'];
    let jiraDtoArray = [];
    for(let issue of mergeList) {
        jiraDtoArray.push(new jiraDto(issue));
    }

    return jiraDtoArray;
}

async function getDataBaseId(name) {
    const proxyUrl = process.env.REACT_APP_PROXY_URL;
    const notionUrl = process.env.REACT_APP_NOTION_URL;
    const url = proxyUrl + notionUrl + CommonUtil.RestNotionSearchUrl;

    let resultList = await callApi(
    'POST',
            url,
    {
                query: name,
                sort: {
                    direction: 'ascending',
                    timestamp: 'last_edited_time',
                },
                filter: {
                    value: 'database',
                    property: 'object'
                },
            },
    {
                headers: {
                    Authorization: 'Bearer ' + process.env.REACT_APP_NOTION_TOKEN,
                    Accept: 'application/json',
                    'Notion-Version': '2022-02-22',
                    'Content-Type': 'application/json',
                }
            }
    );

    return resultList.results[0];
}

async function getDataList(id, cursor) {
    let pageList = [];
    const param = {
        database_id: id,
    };

    if(cursor) {
        param.start_cursor = cursor;
    }

    const proxyUrl = process.env.REACT_APP_PROXY_URL;
    const notionUrl = process.env.REACT_APP_NOTION_URL;
    const url = proxyUrl + notionUrl + `/v1/databases/${id}/query`;

    let result = await callApi(
        'POST',
        url,
        {
            page_size: 100
        },
        {
            headers: {
                Authorization: 'Bearer ' + process.env.REACT_APP_NOTION_TOKEN,
                Accept: 'application/json',
                'Notion-Version': '2022-02-22',
                'Content-Type': 'application/json',
            }
        }
    );

    const has_more = result.has_more;
    const next_cursor = result.next_cursor;
    const results = result.results;

    for(const page of results) {
        pageList.push(page);
    }

    if(has_more) {
        await getDataList(id, next_cursor);
    }

    return pageList;
}

async function insertJiraToNotion(data) {
    const jiraDto = await getHistory(data);
    const { id } = await getDataBaseId('JIRA');
    const dataList = await getDataList(id);

    const proxyUrl = process.env.REACT_APP_PROXY_URL;
    const notionUrl = process.env.REACT_APP_NOTION_URL;
    let url = proxyUrl + notionUrl;

    for(const jira of jiraDto) {
        try {
            let exists = false;
            let existPage = undefined;

            // 중복체크
            for(const page of dataList) {
                if(jira.equals(page)){
                    existPage = page
                    exists = true;
                    break;
                }
            }

            console.log(`exists : ${exists}, jira: ${jira.key}`);

            if(exists) {
                let response = await callApi(
                    'PATCH',
                    url + `/v1/pages/${existPage.id}`,
                    {
                        properties: jira.getNotionProperties()
                    },
                    {
                        headers: {
                            Authorization: 'Bearer ' + process.env.REACT_APP_NOTION_TOKEN,
                            Accept: 'application/json',
                            'Notion-Version': '2022-02-22',
                            'Content-Type': 'application/json',
                        }
                    }
                );
            } else {
                let response = await callApi(
                    'POST',
                    url  + '/v1/pages',
                    {
                        parent: {
                            database_id: id,
                        },
                        properties: jira.getNotionProperties(),
                        // children: jira.getChildren()
                    },
                    {
                        headers: {
                            Authorization: 'Bearer ' + process.env.REACT_APP_NOTION_TOKEN,
                            Accept: 'application/json',
                            'Notion-Version': '2022-02-22',
                            'Content-Type': 'application/json',
                        }
                    }
                );
            }

        }catch (e) {
            console.error(e);
            console.log(jira);
        }
    }

}

export { getHistory, insertJiraToNotion };
import notionClient from "./client";
import { getJiraHistoryDto } from "../jira/base";

let notion;

async function getDataBaseId(name) {
    const resultList = await notion.search(
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

    let result = await notion.query({id: id});

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

async function insertNotion(data, history) {
    notion = new notionClient({
        auth: process.env.REACT_APP_NOTION_TOKEN
    });

    const jiraDto = getJiraHistoryDto(history);
    const { id } = await getDataBaseId('JIRA');
    const dataList = await getDataList(id);

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
            let response;
            if(exists) {
                response = await notion.pageUpdate({
                    id: existPage.id,
                    properties: jira.getNotionProperties()
                });
            } else {
                response = await notion.pageCreate({
                    parent: {
                        database_id: id,
                    },
                    properties: jira.getNotionProperties(),
                    // children: jira.getChildren()
                });
            }
        }catch (e) {
            console.error(e);
            console.log(jira);
        }
    }

    return true;
}

export { insertNotion };
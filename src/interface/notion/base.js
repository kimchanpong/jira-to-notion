import NotionClient from "./client";
import { getJiraHistoryDto } from "../jira/base";

class NotionBase {
    constructor(param) {
        this.notion = new NotionClient({
            auth: param.auth
        });
    }

    getDataBaseId = async (name) => {
        const resultList = await this.notion.search(
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

    getDataList = async (id, cursor) => {
        let pageList = [];
        const param = {
            database_id: id,
        };

        if(cursor) {
            param.start_cursor = cursor;
        }

        let result = await this.notion.query({id: id});

        const has_more = result.has_more;
        const next_cursor = result.next_cursor;
        const results = result.results;

        for(const page of results) {
            pageList.push(page);
        }

        if(has_more) {
            await this.getDataList(id, next_cursor);
        }

        return pageList;
    }

    insertNotion = async (param) => {
        try {
            let exists = false;
            let existPage = undefined;

            // 중복체크
            for(const page of param.dataList) {
                if(param.jira.equals(page)){
                    existPage = page
                    exists = true;
                    break;
                }
            }

            console.log(`exists : ${exists}, jira: ${param.jira.key}`);
            let response;
            if(exists) {
                response = await this.notion.pageUpdate({
                    id: existPage.id,
                    properties: param.jira.getNotionProperties()
                });
            } else {
                response = await this.notion.pageCreate({
                    parent: {
                        database_id: param.id,
                    },
                    properties: param.jira.getNotionProperties(),
                    // children: param.jira.getChildren()
                });
            }

            return true;
        }catch (e) {
            console.error(e);
            console.log(param.jira);

            return false;
        }
    }
}

export default NotionBase;
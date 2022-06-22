import jiraDto from "./dto/jiraDto";
import jiraClient from "./client";

async function getJiraHistory(data) {
    const jira = new jiraClient({
        auth: process.env.REACT_APP_AUTHORIZATION_TOKEN}
    );

    return await jira.history(data);
}

function getJiraHistoryDto(history) {
    const mergeList = history;
    let jiraDtoArray = [];
    for(let issue of mergeList) {
        jiraDtoArray.push(new jiraDto(issue));
    }

    return jiraDtoArray;
}

export { getJiraHistory, getJiraHistoryDto };
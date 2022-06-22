import moment from "moment-timezone";

function dateFormat(dateString) {
    if(dateString === null || dateString === undefined) {
        return undefined;
    }
    return moment(dateString).tz("Asia/Seoul").format();
}


class jiraDto {
    constructor(jira) {
        this.key = jira.key;
        this.reporter = jira.fields.reporter.displayName;
        this.assignee = jira.fields.assignee.displayName;
        this.createDate = dateFormat(jira.fields.created);
        this.resolutiondate = dateFormat(jira.fields.resolutiondate);
        this.duedate = jira.fields.duedate;
        this.link = `https://jira.elandmall.com/browse/${jira.key}`;
        this.title = jira.fields.summary;
        this.description = jira.fields.description;
        this.status = jira.fields.status.name === "작업완료" ? "완료" : "진행중";
    }

    subStringAfter(s, delm) {
        delm = delm || '(';
        if(s.indexOf(delm) > -1) {
            return s.substr(0, s.indexOf(delm))
        }else {
            return s
        }
    }

    getNotionProperties() {
        let property = {};

        if(this.key) {
            property['key'] = {
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: this.key
                        }
                    }
                ]
            };
        }

        if(this.status) {
            property['status'] = {
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: this.status
                        }
                    }
                ]
            };
        }

        if(this.reporter) {
            property['reporter'] = {
                select: {
                    name: this.subStringAfter(this.reporter)
                }
            }
        }

        if(this.assignee) {
            property['assignee'] = {
                select: {
                    name: this.subStringAfter(this.assignee)
                }
            }
        }

        if(this.createDate) {
            property['createDate'] = {
                date: {
                    "start": this.createDate
                }
            }
        }

        if(this.resolutiondate) {
            property['resolutiondate'] = {
                date: {
                    "start": this.resolutiondate
                }
            }
        }

        if(this.duedate) {
            property['duedate'] = {
                date: {
                    "start": this.duedate
                }
            }
        }

        if(this.link) {
            property['link'] = {
                url: this.link
            }
        }

        if(this.title) {
            property['title'] = {
                title: [{
                    text: {
                        content: this.title,
                    }
                }]
            }
        }

        return property;
    }

    getChildren() {

        if(this.description) {
            var textArry = [];

            function addText(string) {
                // textArry.push({
                //     object: 'block',
                //     type: 'paragraph',
                //     paragraph:{
                //         rich_text: [
                //             {
                //                 type: 'text',
                //                 text:{
                //                     content: string
                //                 }
                //             }
                //         ]
                //     }
                // })

                textArry.push(string);
            }

            function addMax1900(str) {
                if(str.length >= 1900) {
                    addText(str.substr(0, 1900))
                    addMax1900(str.substr(1900))
                }else {
                    addText(str)
                }
            }

            this.description.split("\r\n").forEach((v, n) => {
                addMax1900(v);
            });
            return textArry;
        }
    }

    equals(notionPage){
        let equal = false;
        if(typeof notionPage.properties.key.rich_text !== 'undefined') {
            notionPage.properties.key.rich_text.forEach(v => {
                if(v.plain_text === this.key) {
                    equal = true;
                }
            });
        }

        return equal;
    }
}

export default jiraDto;
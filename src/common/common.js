class CommonUtil {
    static get RestSearchUrl() {
        return '/rest/api/2/search';
    }

    static SearchQuerystring(type, data) {
        let querystring = '';
        if(type === 'NGCPO') {
            querystring = `project=NGCPO AND due >= ${data.startDate} AND due <= ${data.endDate} AND assignee in (${data.adAccount}) order by updated DESC`;
        } else {
            querystring = `project=EIH AND resolved >= ${data.startDate} AND resolved <= ${data.endDate} AND watcher in (${data.adAccount}) order by updated DESC`;
        }

        return querystring;
    }
}

export default CommonUtil;
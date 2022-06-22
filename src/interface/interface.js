import axios from "axios";

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

export { callApi };
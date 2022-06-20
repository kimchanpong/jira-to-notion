import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import CommonUtil from "../common/common";
import Interface from "../interface/interface";
import SearchForm from "./SearchForm";
import SearchList from "./SearchList";
import { useForm } from "react-hook-form";

function App() {
    const [loading, setLoading] = useState(false);
    const [historyList, setHistoryList] = useState([]);
    const { register, handleSubmit } = useForm();

    async function getHistory(data) {
        const proxyUrl = process.env.REACT_APP_PROXY_URL;
        const jiraUrl = process.env.REACT_APP_JIRA_URL;
        const url = proxyUrl + jiraUrl + CommonUtil.RestSearchUrl;
        const api = new Interface();

        let getList = await api.callApi('GET', url, {
                "jql":CommonUtil.SearchQuerystring('NGCPO', data), "maxResults":200
            }
        )

        const getListEih = await api.callApi('GET', url, {
                "jql":CommonUtil.SearchQuerystring('EIH', data), "maxResults":200
            }
        )

        const mergeList = getList['issues'].concat(getListEih['issues']);

        setHistoryList(mergeList);
        setLoading(false);
    }

    const onSubmit = (data) => {
        setLoading(true);
        getHistory(data);
    }

    return(
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 5,
                '& .MuiTextField-root': { m: 1, width: '40ch' },
            }}
            noValidate
        >
            <CssBaseline />

            <Typography component="h1" variant="h5">
                지라 월간보고 추출
            </Typography>

            <SearchForm
                register={register}
            />

            <SearchList
                loading={loading}
                historyList={historyList}
            />
        </Box>
    )
}

export default App;
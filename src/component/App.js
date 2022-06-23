import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import SearchForm from "./SearchForm";
import SearchList from "./SearchList";
import { useForm } from "react-hook-form";
import {getJiraHistory, getJiraHistoryDto} from "../interface/jira/base";
import NotionBase from "../interface/notion/base";

function App() {
    const [loading, setLoading] = useState(false);
    const [historyList, setHistoryList] = useState([]);
    const [detect, setDetect] = useState(false);
    const [successCount, setSuccessCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        await interfaceProc(data);
    }

    async function interfaceProc(data) {
        setLoading(true);

        // get jira history
        let getList = await getJiraHistory(data);

        // state set history data
        setHistoryList(getList);
        setTotalCount(getList.length);

        // jira search list -> notion insert
        const notion = new NotionBase({
            auth: process.env.REACT_APP_NOTION_TOKEN
        });

        const jiraDto = getJiraHistoryDto(getList);
        const { id } = await notion.getDataBaseId('JIRA');
        const dataList = await notion.getDataList(id);
        let result = 0;

        for(const jira of jiraDto) {
            result = await notion.insertNotion({
                id: id,
                jira: jira,
                dataList: dataList
            });

            setDetect(result > 0 ? true : false);
        }

        if(totalCount === successCount) {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(detect) {
            setSuccessCount(successCount + 1);
            setDetect(false);
        }

        if(!loading) {
            setSuccessCount(0);
            setTotalCount(0);
        }
    });

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
                Jira -> Notion Data Interface
            </Typography>

            <SearchForm
                register={register}
            />

            <SearchList
                loading={loading}
                successCount={successCount}
                totalCount={totalCount}
                historyList={historyList}
            />
        </Box>
    )
}

export default App;
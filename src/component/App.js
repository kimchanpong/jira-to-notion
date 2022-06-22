import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import SearchForm from "./SearchForm";
import SearchList from "./SearchList";
import { useForm } from "react-hook-form";
import { getJiraHistory } from "../interface/jira/base";
import { insertNotion } from "../interface/notion/base";

function App() {
    const [loading, setLoading] = useState(false);
    const [historyList, setHistoryList] = useState([]);
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);

        // get jira history
        const history = await getJiraHistory(data);

        // jira search list -> notion insert
        const success = await insertNotion(data, history);

        if(success) {
            setHistoryList(history)
            setLoading(false);
        }
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
                지라 -> 노션 등록
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
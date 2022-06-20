import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import CommonUtil from "../common/common";
import Interface from "../interface/interface";
import SearchForm from "./SearchForm";
import SearchList from "./SearchList";


class AppDummy extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: '',
            endDate: '',
            userName: '',
            adAccount: '',
            detail: {},
            loading: false,
            historyList: []
        }
    }

    getHistory = async () => {
        const proxyUrl = process.env.REACT_APP_PROXY_URL;
        const jiraUrl = process.env.REACT_APP_JIRA_URL;
        const url = proxyUrl + jiraUrl + CommonUtil.RestSearchUrl;
        const api = new Interface();

        let getList = await api.callApi('GET', url, {
                "jql":CommonUtil.SearchQuerystring('NGCPO', this.state), "maxResults":200
            }
        )

        const getListEih = await api.callApi('GET', url, {
                "jql":CommonUtil.SearchQuerystring('EIH', this.state), "maxResults":200
            }
        )

        const mergeList = getList['issues'].concat(getListEih['issues']);

        this.setState({
            historyList: mergeList,
            loading: false
        });
    }

    renderLoading = () => {
        this.setState({
            loading: true
        });
    }

    handleTag = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.renderLoading();
        this.getHistory();
    };

    render() {
        return(
            <Box
                component="form"
                onSubmit={this.handleSubmit}
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
                    handleTag={this.handleTag}
                />

                <SearchList
                    loading={this.state.loading}
                    historyList={this.state.historyList}
                />
            </Box>
        )
    }
}

export default AppDummy;
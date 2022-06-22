import React from 'react';
import HistoryTable from "./HistoryTable";
import Box from "@mui/material/Box";
import HistoryLoading from "./HistoryLoading";

function SearchList(props) {
    return (
        <Box sx={{
            marginTop: 5,
            marginBottom: 10
        }}>
            {
                props.loading ?
                    <HistoryLoading
                        totalCount={props.totalCount}
                    />
                    :
                    props.historyList.length > 0 ?
                        <HistoryTable historyList={props.historyList} />
                        :
                        '등록된 내역이 없습니다.'
            }
        </Box>
    )
}

export default SearchList;
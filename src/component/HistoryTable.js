import React from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function HistoryTable(props) {
    return (
        <div>
            <Typography
                sx={{
                    alignItems: 'center',
                }}
                // variant="h6"
                // component="div"
                component="h1"
                variant="h5"
            >
                Notion 연동 내역
            </Typography>

            <TableContainer sx={{marginTop: 2}} component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">지라번호</TableCell>
                            <TableCell align="center">기간산정 ID</TableCell>
                            <TableCell align="center">제목</TableCell>
                            <TableCell align="center">생성일시</TableCell>
                            <TableCell align="center">기한</TableCell>
                            <TableCell align="center">담당자</TableCell>
                            <TableCell align="center">보고자</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            props.historyList.map((data, idx) => {
                                const key = data.key;
                                const summary = data.fields.summary;

                                // 생성일자 dateformat
                                const tempCreated = data.fields.created;
                                const convertDate = new Date(tempCreated);
                                let month = convertDate.getMonth() + 1;
                                let day = convertDate.getDate();
                                month = (month >= 10) ? month : '0' + month;
                                day = (day >= 10) ? day : '0' + day;
                                const created = convertDate.getFullYear() + '-' + month + '-' + day;

                                // 기한일자 dateformat
                                let tempDuedate = data.fields.duedate;
                                if(tempDuedate == null) {
                                    tempDuedate = data.fields.resolutiondate;
                                }
                                const convertDuedate = new Date(tempDuedate);
                                let monthForDuedate = convertDuedate.getMonth() + 1;
                                let dayForDuedate = convertDuedate.getDate();
                                monthForDuedate = (monthForDuedate >= 10) ? monthForDuedate : '0' + monthForDuedate;
                                dayForDuedate = (dayForDuedate >= 10) ? dayForDuedate : '0' + dayForDuedate;
                                const duedate = convertDuedate.getFullYear() + '-' + monthForDuedate + '-' + dayForDuedate;

                                // 담당자
                                let assignee = data.fields.assignee.displayName;
                                assignee= assignee.substring(0, assignee.indexOf('('));

                                // 보고자
                                let reporter = data.fields.reporter.displayName;
                                reporter= reporter.substring(0, reporter.indexOf('('));

                                return (
                                    <TableRow
                                        key={key}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" align="center">
                                            {key}
                                        </TableCell>
                                        <TableCell align="center">&nbsp;</TableCell>
                                        <TableCell align="left">{summary}</TableCell>
                                        <TableCell align="center">{created}</TableCell>
                                        <TableCell align="center">{duedate}</TableCell>
                                        <TableCell align="center">{assignee}</TableCell>
                                        <TableCell align="center">{reporter}</TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default HistoryTable;
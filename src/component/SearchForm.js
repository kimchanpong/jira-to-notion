import React from 'react';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

function SearchForm(props) {
    return (
        <div>
            <Box
                sx={{
                    marginTop: 1
                }}
            >
                <TextField
                    id="startDate"
                    name="startDate"
                    label="기한 시작일시"
                    helperText="지라 시작 기준일(ex: 2022-01-01)"
                    {...props.register('startDate')}
                />
                <TextField
                    id="endDate"
                    name="endDate"
                    label="기한 종료일시"
                    helperText="지라 종료 기준일(ex: 2022-12-31)"
                    {...props.register('endDate')}
                />
            </Box>
            <Box
                sx={{
                    marginTop: 1
                }}
            >
                <TextField
                    id="adAccount"
                    name="adAccount"
                    label="AD 계정"
                    helperText="노트북 로그인 계정(ex: Hong.Kildong)"
                    {...props.register('adAccount')}
                />
            </Box>
            <Box
                sx={{
                    marginTop: 1
                }}
            >
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 1, mb: 2 }}
                >
                    등록
                </Button>
            </Box>
            <Divider
                sx={{
                    marginTop: 1
                }}
            />
        </div>
    )
}

export default SearchForm;
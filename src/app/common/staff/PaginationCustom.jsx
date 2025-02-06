import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {observer} from "mobx-react";
import {useStore} from "../../stores";

const useStyles = makeStyles((theme) => ({
    paginationContainer: {
        marginTop: theme.spacing(2),
        "& > *": {
            marginTop: theme.spacing(2),
        },
        display: "flex",
        justifyContent: "end",
    },
    paginationTextContainer: {
        marginTop: theme.spacing(0),
        display: "flex",
        justifyItems: "center",
    },
    recordText: {
        margin: theme.spacing(0),
        display: "flex",
        alignItems: "center",
        marginRight: theme.spacing(2),
    },
    selectFormControl: {
        margin: theme.spacing(1),
    },
}));

export default function PaginationCustom(
    {
        rowsPerPage,
        setRowsPerPage,
        totalPages,
        page,
        handleChangePage,
        pageSizeOption = [10, 15, 20, 25, 30],
    }
) {
    const {countryStore} = useStore(); // Đổi từ campaignStore sang agentStore

    const classes = useStyles();
    return (
        <div className={classes.paginationContainer}>
            <div className={classes.paginationTextContainer}>
                <p className={classes.recordText}>Tổng số bản ghi: {countryStore.totalElements}</p>
            </div>
            <div className={classes.paginationTextContainer}>
                <p className={classes.recordText}>Số hàng mỗi trang:</p>
                <FormControl className={classes.selectFormControl}>
                    <Select
                        value={rowsPerPage}
                        onChange={setRowsPerPage}
                    >
                        {pageSizeOption.map((option, index) => (
                            <MenuItem key={index} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <Pagination
                className={classes.paginationTextContainer}
                count={totalPages}
                variant="outlined"
                shape="rounded"
                page={page}
                onChange={handleChangePage}
            />
        </div>
    );
};

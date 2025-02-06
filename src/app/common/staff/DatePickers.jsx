import 'date-fns';
import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker,
} from '@material-ui/pickers';

export default function DatePickers({
                                        onChange,
                                        value,
                                        isTime = true,
                                        labelDate = 'Select Date',
                                        format = 'MM/dd/yyyy',
                                        className,
                                    }) {
    const [selectedDate, setSelectedDate] = useState(value);
    const [openTimePicker, setOpenTimePicker] = useState(false);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        onChange(date);
    };

    const handleDateAccept = (date) => {
        handleDateChange(date);
        if (isTime) {
            setOpenTimePicker(true);
        }
    };

    const handleTimeChange = (time) => {
        setSelectedDate(time);
        onChange(time);
        setOpenTimePicker(false);
    };

    return (<MuiPickersUtilsProvider utils={DateFnsUtils}
    >
        <Grid className={className}
              style={{
                  border: "1px solid #e4e4e4", borderRadius: "4px",
              }}
        >
            <KeyboardDatePicker
                label={labelDate}
                format={format}
                value={selectedDate}
                onChange={handleDateChange}
                onAccept={handleDateAccept}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
                InputProps={{
                    disableUnderline: true,
                    style: {
                        paddingLeft: '14px',
                    },
                }}
                InputLabelProps={{
                    style: {
                        paddingLeft: '14px'
                    },
                }}
                style={{width: '100%'}}

            />
            {isTime && (<KeyboardTimePicker
                margin="normal"
                id="time-picker-popup"
                value={selectedDate}
                onChange={handleTimeChange}
                open={openTimePicker}
                onClose={() => setOpenTimePicker(false)}
                KeyboardButtonProps={{
                    'aria-label': 'change time',
                }}
                style={{display: 'none'}}
            />)}
        </Grid>
    </MuiPickersUtilsProvider>);
}

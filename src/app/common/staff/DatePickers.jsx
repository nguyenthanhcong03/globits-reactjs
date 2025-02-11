import "date-fns";
import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
  DateTimePicker,
  DatePicker,
} from "@material-ui/pickers";
import { TextField } from "@material-ui/core";

export default function DatePickers({
  //   onChange,
  //   value,
  //   isTime = true,
  //   labelDate = "Select Date",
  //   format = "MM/dd/yyyy",
  className,
  value,
  onChange,
  isTime = true,
  label,
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

  return (
    <div>
      {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid
            className={className}
            style={{
              border: "1px solid #e4e4e4",
              borderRadius: "4px",
            }}
          >
            <KeyboardDatePicker
              label={labelDate}
              format={format}
              value={selectedDate}
              onChange={handleDateChange}
              onAccept={handleDateAccept}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              InputProps={{
                disableUnderline: true,
                style: {
                  paddingLeft: "14px",
                },
              }}
              InputLabelProps={{
                style: {
                  paddingLeft: "14px",
                },
              }}
              style={{ width: "100%" }}
            />
            {isTime && (
              <KeyboardTimePicker
                margin="normal"
                id="time-picker-popup"
                value={selectedDate}
                onChange={handleTimeChange}
                open={openTimePicker}
                onClose={() => setOpenTimePicker(false)}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
                style={{ display: "none" }}
              />
            )}
          </Grid>
        </MuiPickersUtilsProvider> */}
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {isTime ? (
          <DateTimePicker
            value={value}
            onChange={onChange}
            ampm={false} // 24h format
            // disablePast // Không chọn ngày quá khứ
            format="dd/MM/yyyy HH:mm" // Định dạng ngày giờ
            inputVariant="outlined"
            fullWidth
            TextFieldComponent={(props) => (
              <TextField {...props} label={label || "Chọn ngày & giờ"} variant="outlined" />
            )}
          />
        ) : (
          <DatePicker
            value={value}
            onChange={onChange}
            // disablePast
            format="dd/MM/yyyy"
            inputVariant="outlined"
            fullWidth
            TextFieldComponent={(props) => <TextField {...props} label={label || "Chọn ngày"} variant="outlined" />}
          />
        )}
      </MuiPickersUtilsProvider>
    </div>
  );
}

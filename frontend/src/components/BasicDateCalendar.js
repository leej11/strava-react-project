import React, { useContext } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers";
import { ActivitiesContext } from "../context/ActivityContext";

const Day = ({ ...dayProps }) => {
  const { activities } = useContext(ActivitiesContext);
  console.log("Here's activites", activities);
  // console.log({ ...dayProps });
  // console.log(typeof dayProps.day);
  // console.log(dayProps.day.getFullYear());
  // console.log(dayProps.day.getTime());

  const targetDate = new Date(2024, 4, 10);

  const isEqualToTargetDate =
    targetDate.getFullYear() === dayProps.day.getFullYear() &&
    targetDate.getMonth() === dayProps.day.getMonth() &&
    targetDate.getDate() === dayProps.day.getDate();

  if (!isEqualToTargetDate) {
    return <PickersDay {...dayProps} />;
  } else {
    console.log({ ...dayProps });
    console.log(dayProps.day.toString());
    return (
      <PickersDay
        {...dayProps}
        sx={{ border: "1px red solid", bgcolor: "yellow" }}
      >
        15.4K
      </PickersDay>
    );
  }
};

export default function BasicDateCalendar() {
  return (
    <DateCalendar
      slots={{
        day: Day,
      }}
    />
  );
}

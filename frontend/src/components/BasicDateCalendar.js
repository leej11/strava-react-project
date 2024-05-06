import React, { useContext } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers";
import { ActivitiesContext } from "../context/ActivityContext";
import { formatDistanceToNow, formatDate } from "date-fns";

const Day = ({ ...dayProps }) => {
  const { activities } = useContext(ActivitiesContext);

  // Extract start dates and total distances from activities
  const activityData = activities
    ? activities.map((activity) => ({
        date: new Date(activity.startdate),
        totalDistance: activity.totaldistance,
      }))
    : [];

  // console.log({ ...dayProps });
  // console.log(typeof dayProps.day);
  // console.log(dayProps.day.getFullYear());
  // console.log(dayProps.day.getTime());

  // Check if the current day matches any start date
  const matchingActivity = activityData.find((activity) => {
    return (
      activity.date.getFullYear() === dayProps.day.getFullYear() &&
      activity.date.getMonth() === dayProps.day.getMonth() &&
      activity.date.getDate() === dayProps.day.getDate()
    );
  });

  if (matchingActivity) {
    console.log({ ...dayProps });
    return (
      <PickersDay
        {...dayProps}
        sx={{ border: "1px red solid", bgcolor: "yellow" }}
      >
        {(matchingActivity.totalDistance / 1000).toFixed(1) + "K"}
      </PickersDay>
    );
  } else {
    return <PickersDay {...dayProps} />;
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

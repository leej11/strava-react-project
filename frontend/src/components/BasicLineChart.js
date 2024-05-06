import Plot from "react-plotly.js";

import React from "react";

function BarChart({ data }) {
  const x_vals = data.map((row) => row.year_name);
  const y_vals = data.map((row) => row.sum);
  console.log(x_vals);
  console.log(y_vals);
  return (
    <Plot
      data={[
        {
          x: x_vals,
          y: y_vals,
          // x: ["January", "February", "March", "April"],
          // y: [57.8, 41.5, 84.5, 36],
          type: "bar",
          marker: {
            // Specify the bar color
            color: "rgb(113, 230, 202)", // Neon pastel green
          },
        },
      ]}
      layout={{
        title: "My Monthly Running",
        margin: {
          b: 150,
          pad: 0,
        },
        xaxis: {
          title: "Month",
          linecolor: "#ffffff", // White
          tickcolor: "#ffffff", // White
          tickangle: -70,
          dtick: 3,
        },
        yaxis: {
          title: "Distance (km)",
          linecolor: "#ffffff", // White
          tickcolor: "#ffffff", // White
        },
        width: "100%",
        // height: "100%",
        plot_bgcolor: "#343434",
        // Specify font color
        // font: { color: "#D8D8D8" }, // Off-white grey
        paper_bgcolor: "#343434",
        font: { color: "#ffffff" }, // White
      }}
    />
  );
}

function BasicLineChart() {
  return (
    <Plot
      data={[
        {
          x: [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 50],
          y: [32, 37, 40.5, 43, 49, 54, 59, 63.5, 69.5, 73, 74, 2],
          mode: "markers",
          type: "scatter",
        },
      ]}
      layout={{
        title: "Growth Rate in Boys",
        xaxis: {
          title: "Age (years)",
        },
        yaxis: {
          title: "Height (inches)",
        },
      }}
    />
  );
}

function MultiLineChart() {
  return (
    <Plot
      data={[
        {
          x: [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18],
          y: [32, 37, 40.5, 43, 49, 54, 59, 63.5, 69.5, 73, 74],
          mode: "markers",
          type: "scatter",
          name: "Boys",
        },
        {
          x: [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18],
          y: [30, 36, 39, 42, 48, 53, 58, 62, 67.5, 68, 68.5],
          mode: "lines+markers",
          type: "scatter",
          name: "Girls",
          marker: { color: "red" },
        },
      ]}
      layout={{
        title: "Growth Rate in Children",
        xaxis: {
          title: "Age (years)",
        },
        yaxis: {
          title: "Height (inches)",
        },
        width: 600,
        height: 500,
      }}
    />
  );
}

export { BasicLineChart, MultiLineChart, BarChart };

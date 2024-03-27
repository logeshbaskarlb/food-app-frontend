import React from "react";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@mui/material";
import "../index.css"

const DataTables = ({columns ,data , title , actions}) => {
  const defaultTheme = createTheme();

  return (
    <div>
      <ThemeProvider theme={defaultTheme}>
        <MaterialTable
            columns={columns}
            data={data}
            title={title}
            actions={actions}
        />
      </ThemeProvider>
    </div>
  );
};

export default DataTables;

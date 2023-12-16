import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbarContainer,
  GridSelectionModel,
  ValueOptions,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useStore } from "stores";
import { toJS } from "mobx";
import { tableBaseSX } from "utils/theme";
import ScheduleForm from "./ScheduleForm";
import ImportForm from "./ImportForm";

export type DialogModelType = "add" | "change" | undefined;

type Props = {};

const Schedules = (props: Props) => {
  const { flightStore } = useStore();

  const airportOptions = () =>
    flightStore.airports.map(
      (el) =>
        ({
          value: el.IATACode, // el.id,
          label: el.name,
        } as ValueOptions)
    );

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const moneyFormatter = (params: GridValueFormatterParams) =>
    currencyFormatter.format(params.value);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 30, hide: true },
    { field: "date", headerName: "Date", type: "date", width: 120 },
    { field: "time", headerName: "Time", width: 100 },
    {
      field: "from",
      headerName: "From",
      type: "singleSelect",
      valueOptions: airportOptions,
      width: 80,
      // valueFormatter: airportFormatter
    },
    {
      field: "to",
      headerName: "To",
      type: "singleSelect",
      valueOptions: airportOptions,
      width: 80,
      // valueFormatter: airportFormatter
    },
    {
      field: "flightNumber",
      headerName: "Flight number",
      type: "number",
      width: 120,
    },
    { field: "aircraft", headerName: "Aircraft", flex: 1, minWidth: 150 },
    {
      field: "economyPrice",
      headerName: "Economy price",
      width: 120,
      type: "number",
      valueFormatter: moneyFormatter,
    },
    {
      field: "businessPrice",
      headerName: "Business price",
      width: 120,
      type: "number",
      valueFormatter: moneyFormatter,
    },
    {
      field: "firstClassPrice",
      headerName: "First class price",
      width: 120,
      type: "number",
      valueFormatter: moneyFormatter,
    },
    {
      field: "confirmed",
      headerName: "Confirmation",
      type: "boolean",
      width: 50,
      hide: true,
    },
  ];

  useEffect(() => {
    if (flightStore) {
      flightStore.getSchedules();
      flightStore.getAirports();
    }

    return;
  }, []);

  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

  const [dialogModel, setDialogModel] = useState<DialogModelType>();

  const handleClose = () => {
    if (!!dialogModel) setDialogModel(undefined);
  };

  return (
    <>
      <Box sx = {{ display: "flex", flexDirection: "row", marginBottom: "1rem" }}>
        <Button
          color="info"
          variant="contained"
          onClick={() => {
            setDialogModel("add");
          }}
          sx = {{}}
        >
          Import schedules
        </Button>
        <Button
          color="warning"
          variant="contained"
          onClick={() => {
            setDialogModel("change");
          }}
          sx={{
            overflow: "hidden",
            textAlign: "center",
            marginX: "1rem",
            display: !selectionModel.length ? "none" : "block",
          }}
        >
          Edit flight
        </Button>
        <Button
          color={
            flightStore.scheduleByID(selectionModel[0])?.confirmed
              ? "error"
              : "success"
          }
          variant="contained"
          onClick={() => flightStore.switchConfirm(selectionModel[0])}
          sx={{
            overflow: "hidden",
            textAlign: "center",
            display: !selectionModel.length ? "none" : "block",
          }}
        >
          {flightStore.scheduleByID(selectionModel[0])?.confirmed
            ? "Cancel flight"
            : "Confirm flight"}
        </Button>
      </Box>
      <DataGrid
        rows={toJS(flightStore.schedules)}
        columns={columns}
        autoHeight
        loading={flightStore.status === "pending"}
        sx={tableBaseSX}
        getRowClassName={(params) => `row-status--${!!params.row.confirmed}`}
        selectionModel={selectionModel}
        onSelectionModelChange={(newModel, opt) => {
          setSelectionModel(newModel);
        }}
      />
      <ScheduleForm
        open={dialogModel === "change"}
        handleClose={handleClose}
        flightId={useMemo(() => selectionModel[0], [selectionModel[0]])}
      />
      <ImportForm open={dialogModel === "add"} handleClose={handleClose} />
    </>
  );
};

export default observer(Schedules);

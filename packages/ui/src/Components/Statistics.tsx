import React, { useState, useEffect } from "react";
import {
  DataTable,
  TableContainer,
  Table,
  TableRow,
  TableBody,
  TableCell,
} from "carbon-components-react";
import { withTranslation } from "react-i18next";
import { t } from "i18next";
import ApiRequestService from "../Services/ApiRequestService";

type RowData = {
  id: string;
  name: string;
  value: string;
};

const headerData = [
  {
    key: "name",
    header: "name",
  },
  {
    key: "value",
    header: "value",
  },
];

const apiService = new ApiRequestService();

const Statistics = ({ t }: { t: any }) => {
  const [statistics, setStatistics] = useState<RowData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiService.getStatistics();
      setStatistics([
        {
          id: "visitors_today",
          name: t("STATS.VISITORS_TODAY"),
          value: response.visitors.todayCalls.toString(),
        },
        {
          id: "visitors_yesterday",
          name: t("STATS.VISITORS_YESTERDAY"),
          value: response.visitors.yesterdayCalls.toString(),
        },
      ]);
    };
    fetchData();
  }, []);
  return (
    <DataTable rows={statistics} headers={headerData}>
      {({
        rows,
        getTableProps,
      }: {
        rows: any;
        headers: any;
        getHeaderProps: any;
        getTableProps: any;
      }) => (
        <TableContainer title={t("STATS.TITLE")}>
          <Table {...getTableProps()}>
            <TableBody>
              {rows.map(
                (row: { id: React.Key | null | undefined; cells: any[] }) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  );
};

export default withTranslation()(Statistics);

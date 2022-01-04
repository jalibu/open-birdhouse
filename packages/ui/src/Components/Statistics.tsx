import React, { useState, useEffect, useContext } from "react";
import {
  DataTable,
  TableContainer,
  Table,
  TableRow,
  TableBody,
  TableCell,
  StructuredListSkeleton,
} from "carbon-components-react";
import { withTranslation } from "react-i18next";
import ApiRequestService from "../Services/ApiRequestService";
import StatusContext from "../Context/StatusContext/StatusContext";

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

const Statistics = ({ t }: { t: any }) => {
  const statusContext = useContext(StatusContext);
  const apiService = new ApiRequestService(statusContext);
  const [statistics, setStatistics] = useState<RowData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiService.getStatistics();
      if (response) {
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
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  return statistics.length > 0 ? (
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
  ) : (
    <div>
      <StructuredListSkeleton />
    </div>
  );
};

export default withTranslation()(Statistics);

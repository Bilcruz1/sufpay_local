import {
  Box,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  // Add more rows as needed
];

const DashboardHistories: React.FC<{ title: string; linkUrl: string }> = ({
  title,
  linkUrl,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        border: "1px solid #66666628",
        padding: "1.2rem .7rem",
        borderRadius: "5px",
        width: "100%",
        height: "35vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <Typography variant="h5">{title}</Typography>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate(linkUrl)}
          sx={{ cursor: "pointer" }}
        >
          View all
        </Link>
      </Box>

      {/* Table Section */}
      <TableContainer
        component={Paper}
        sx={{
          flexGrow: 1,
          boxShadow: "none",
          maxHeight: "100%",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
        }}
      >
        <Table stickyHeader sx={{ minWidth: 650, border: 0 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#fff",
                  borderBottom: 0,
                  fontWeight: "bold",
                }}
              >
                Transactions
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#fff",
                  borderBottom: 0,
                  fontWeight: "bold",
                }}
              >
                Amount
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#fff",
                  borderBottom: 0,
                  fontWeight: "bold",
                }}
              >
                Status
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#fff",
                  borderBottom: 0,
                  fontWeight: "bold",
                }}
              >
                Date
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#fff",
                  borderBottom: 0,
                  fontWeight: "bold",
                }}
              >
               
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell sx={{ borderBottom: 0 }}>{row.name}</TableCell>
                <TableCell align="right" sx={{ borderBottom: 0 }}>
                  {row.calories}
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: 0 }}>
                  {row.fat}
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: 0 }}>
                  {row.carbs}
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: 0 }}>
                  {row.protein}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DashboardHistories;

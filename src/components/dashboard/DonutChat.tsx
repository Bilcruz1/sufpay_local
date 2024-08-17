import { Height } from "@mui/icons-material";
import { Box } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Event and ticket", value: 20000 },
  { name: "Utility", value: 20000 },
  { name: "Airtime", value: 15000 },
  { name: "Transportation", value: 12000 },
  { name: "Cable and TV", value: 9000 },
];

const COLORS = ["#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107"];

const DonutChart = () => {
  return (
    <Box
      sx={{
        border: "1px solid #66666628",
        borderRadius: "5px",
        height: "calc(70vh + 1rem)",
        width: "100%",
      }}
    >
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default DonutChart;

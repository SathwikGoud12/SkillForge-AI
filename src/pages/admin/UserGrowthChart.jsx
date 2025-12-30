import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";

const UserGrowthChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">User Growth</h2>
        <p className="text-gray-500">No data yet</p>
      </div>
    );
  }

  const option = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: data.map((d) => d.month),
    },
    yAxis: { type: "value" },
    series: [
      {
        data: data.map((d) => d.users),
        type: "line",
        smooth: true,
        areaStyle: {},
        lineStyle: { width: 4 },
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow p-6"
    >
      <h2 className="text-lg font-semibold mb-4">User Growth</h2>
      <ReactECharts option={option} style={{ height: 300 }} />
    </motion.div>
  );
};

export default UserGrowthChart;

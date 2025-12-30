import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";

const AverageScoreByDomain = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">
          Average Score by Domain
        </h2>
        <p className="text-gray-500">No data yet</p>
      </div>
    );
  }

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.map(d => d.domain),
      axisLabel: {
        rotate: 25,
        color: "#555",
      },
    },
    yAxis: {
      type: "value",
      max: 100,
    },
    series: [
      {
        name: "Avg Score",
        type: "bar",
        data: data.map(d => d.avgScore),
        barWidth: "45%",
        itemStyle: {
          color: "#6366f1",
          borderRadius: [8, 8, 0, 0],
          shadowBlur: 10,
          shadowColor: "rgba(99,102,241,0.4)",
        },
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow"
    >
      <h2 className="text-lg font-semibold mb-4">
        Average Score by Domain
      </h2>

      <ReactECharts
        option={option}
        style={{ height: 320 }}
      />
    </motion.div>
  );
};

export default AverageScoreByDomain;

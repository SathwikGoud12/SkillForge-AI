import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const UserGrowthChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 flex flex-col items-center justify-center min-h-[300px]">
        <TrendingUp className="w-12 h-12 text-slate-200 mb-4" />
        <h2 className="text-lg font-black text-slate-400 uppercase tracking-widest">Growth Analytics</h2>
        <p className="text-slate-400 text-sm font-medium mt-1">Pending user registration data...</p>
      </div>
    );
  }

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "#fff",
      borderWidth: 0,
      padding: 15,
      textStyle: { color: "#1e293b", fontWeight: "bold" },
      shadowBlur: 20,
      shadowColor: "rgba(0,0,0,0.1)",
      borderRadius: 12
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "5%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((d) => d.month),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#94a3b8", fontWeight: "bold", margin: 20 }
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { type: "dashed", color: "#f1f5f9" } },
      axisLine: { show: false },
      axisLabel: { color: "#94a3b8", fontWeight: "bold" }
    },
    series: [
      {
        name: "Active Users",
        data: data.map((d) => d.users),
        type: "line",
        smooth: 0.4,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: { color: "#4f46e5" },
        lineStyle: { width: 4, color: "#4f46e5", shadowBlur: 10, shadowColor: "rgba(79, 70, 229, 0.3)" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(79, 70, 229, 0.2)" },
              { offset: 1, color: "rgba(79, 70, 229, 0)" }
            ]
          }
        },
        animationDuration: 2000,
        animationEasing: "cubicInOut"
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Ecosystem Growth</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Learner Registration Velocity</p>
        </div>
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
        </div>
      </div>
      <ReactECharts option={option} style={{ height: 350 }} />
    </motion.div>
  );
};

export default UserGrowthChart;

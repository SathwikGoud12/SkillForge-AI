import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, color = "violet" }) => {
  const colorMap = {
    violet: "from-violet-500 to-indigo-600",
    blue: "from-blue-500 to-cyan-500",
    emerald: "from-emerald-500 to-green-600",
    amber: "from-amber-400 to-orange-500",
    rose: "from-rose-500 to-pink-600",
    indigo: "from-indigo-600 to-blue-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-slate-100 flex items-center gap-6 relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorMap[color]} opacity-5 rounded-bl-full -mr-4 -mt-4 group-hover:scale-110 transition-transform`} />

      <div className={`w-14 h-14 bg-gradient-to-br ${colorMap[color]} rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
        {Icon && <Icon className="w-7 h-7" />}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <h2 className="text-3xl font-black text-slate-900 truncate">
          {value || 0}
        </h2>
      </div>
    </motion.div>
  );
};

export default StatCard;

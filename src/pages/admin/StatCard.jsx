import { motion } from "framer-motion";
const StatCard = ({ title, value }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-4xl font-bold mt-2 text-indigo-600">
        {value}
      </h2>
    </motion.div>
  );
};

export default StatCard;

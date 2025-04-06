import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color }) => {
  return (
    <motion.div
      className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/80 backdrop-blur-md overflow-hidden shadow-md rounded-md border border-slate-700/40 group"
      whileHover={{ 
        y: -3, 
        transition: { duration: 0.2 }
      }}
    >
      <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: color }}></div>
      <div className="px-5 py-6">
        <span className="flex items-center text-sm font-medium text-slate-300">
          <Icon size={18} className="mr-2.5" style={{ color }} />
          {name}
        </span>
        <p className="mt-2 text-3xl font-semibold text-white tracking-tight">{value}</p>
      </div>
      <div 
        className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
        style={{ backgroundImage: `linear-gradient(to right, ${color}20, transparent)` }}
      ></div>
    </motion.div>
  );
};

export default StatCard;
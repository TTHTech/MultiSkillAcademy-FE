import React from "react";
import { 
  LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell, Area, AreaChart
} from 'recharts';
import { ChevronLeft, User, DollarSign, Percent, BarChart2, PieChart as PieChartIcon } from 'lucide-react';

const InstructorRevenueDetail = ({
  instructorDetails,
  monthlyRevenue,
  selectedYear,
  onBackClick
}) => {
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format percentage
  const formatPercent = (value) => {
    return value.toFixed(1) + "%";
  };

  // Màu sắc cho biểu đồ
  const COLORS = {
    revenue: "#4f46e5", // indigo-600
    instructorShare: "#10b981", // emerald-500
    referral: {
      instructor: "#8b5cf6", // violet-500
      platform: "#06b6d4" // cyan-500
    }
  };

  // Custom tooltip cho biểu đồ line
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-md shadow-lg p-3 text-sm">
          <p className="font-medium text-white mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="flex items-center">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
              <span className="font-medium mr-2">{entry.name}:</span>
              {entry.name === "Doanh thu" 
                ? `${entry.value.toLocaleString()} Triệu VNĐ`
                : formatCurrency(entry.value * 1000000)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip cho biểu đồ pie
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-md shadow-lg p-3 text-sm">
          <p style={{ color: payload[0].color }} className="font-medium">
            {payload[0].name}: {payload[0].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend cho biểu đồ
  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-2">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-300 text-sm">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  if (!instructorDetails) return null;

  // Dữ liệu phân bổ cho biểu đồ tròn
  const pieData = [
    { 
      name: "Giảng viên giới thiệu", 
      value: instructorDetails.instructorReferredPercentage || 0,
      color: COLORS.referral.instructor
    },
    { 
      name: "Nền tảng giới thiệu", 
      value: 100 - (instructorDetails.instructorReferredPercentage || 0),
      color: COLORS.referral.platform
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header với nút quay lại */}
      <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
        <button
          onClick={onBackClick}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium shadow-sm"
        >
          <ChevronLeft size={18} className="mr-1" />
          Quay lại danh sách
        </button>
        
        <div className="px-4 py-2 bg-gray-700 rounded-md text-gray-200 font-medium flex items-center">
          <BarChart2 size={18} className="mr-2 text-yellow-400" />
          Năm: {selectedYear}
        </div>
      </div>
      
      {/* Instructor header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mr-4">
            <User size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {instructorDetails.instructorFirstName} {instructorDetails.instructorLastName}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-700 p-4 rounded-lg flex items-center border border-gray-600 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
              <User size={18} className="text-blue-300" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">ID Giảng viên</p>
              <p className="text-white font-semibold">{instructorDetails.instructorId}</p>
            </div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg flex items-center border border-gray-600 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
              <DollarSign size={18} className="text-green-300" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Tổng doanh thu</p>
              <p className="text-green-400 font-semibold">{formatCurrency(instructorDetails.totalRevenue)}</p>
            </div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg flex items-center border border-gray-600 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
              <Percent size={18} className="text-yellow-300" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Phần chia GV</p>
              <p className="text-blue-400 font-semibold">
                {formatCurrency(instructorDetails.instructorShare)} 
                <span className="text-yellow-400 ml-1">
                  ({formatPercent(instructorDetails.effectiveSharePercentage || 0)})
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Monthly revenue chart - Enhanced */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center mb-4">
          <BarChart2 size={20} className="text-blue-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">Doanh thu theo tháng (Triệu VNĐ)</h3>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyRevenue}
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.revenue} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.revenue} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorShare" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.instructorShare} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.instructorShare} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#999" 
                tick={{ fill: '#cbd5e1' }}
                axisLine={{ stroke: '#444' }}
                tickLine={{ stroke: '#444' }}
              />
              <YAxis 
                stroke="#999" 
                tick={{ fill: '#cbd5e1' }}
                axisLine={{ stroke: '#444' }}
                tickLine={{ stroke: '#444' }}
                tickFormatter={(value) => `${value}M`}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              
              <Area
                type="monotone"
                dataKey="totalRevenueMillions"
                name="Doanh thu"
                stroke={COLORS.revenue}
                strokeWidth={2}
                fill="url(#colorRevenue)"
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
              
              <Line
                type="monotone"
                dataKey="instructorShare"
                name="Phần chia GV" 
                stroke={COLORS.instructorShare}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 0, fill: COLORS.instructorShare }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Revenue sources - Enhanced */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center mb-4">
          <PieChartIcon size={20} className="text-indigo-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">Phân bổ doanh thu theo nguồn</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-gray-300 font-medium flex items-center">
              <div className="w-2 h-6 bg-indigo-500 rounded-r mr-2"></div>
              Nguồn doanh thu
            </h4>
            
            {pieData.map((item, index) => (
              <div 
                key={`source-${index}`}
                className="flex justify-between items-center p-4 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-650 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-3" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-200">{item.name}</span>
                </div>
                <span 
                  className="text-xl font-bold" 
                  style={{ color: item.color }}
                >
                  {formatPercent(item.value)}
                </span>
              </div>
            ))}
            
            <div className="p-4 rounded-lg border border-dashed border-gray-600 bg-gray-750 mt-4">
              <p className="text-gray-400 text-sm">
                Tỷ lệ phân bổ doanh thu được tính dựa trên nguồn đăng ký của học viên. 
                Giảng viên được hưởng tỷ lệ cao hơn cho các học viên do họ giới thiệu.
              </p>
            </div>
          </div>
          
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="rgba(0,0,0,0.1)"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorRevenueDetail;
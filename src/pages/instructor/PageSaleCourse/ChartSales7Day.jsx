import React from 'react';
import ReactApexChart from 'react-apexcharts';
const dayColors = ['#FF5722', '#FFC107', '#4CAF50', '#2196F3', '#9C27B0', '#E91E63', '#00BCD4'];
const ChartSales = ({ dailySalesLast7Days }) => {
  const categories = dailySalesLast7Days.map(item => {
    const [year, month, day] = item.period.split('-');
    return `${parseInt(day, 10)}/${parseInt(month, 10)}`;
  });
  const data = dailySalesLast7Days.map(item => item.enrollments);
  const total = data.reduce((sum, val) => sum + val, 0);
  const options = {
    colors: dayColors.slice(0, data.length),
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 360,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '45%',
        distributed: true,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      labels: { style: { fontSize: '14px', fontWeight: 500 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { fontSize: '14px' } },
    },
    grid: {
      borderColor: '#E0E0E0',
      strokeDashArray: 4,
    },
    tooltip: {
      y: { formatter: val => `${val} Khóa học` },
    },
    fill: { opacity: 0.9 },
    responsive: [
      {
        breakpoint: 1024,
        options: { plotOptions: { bar: { columnWidth: '60%' } } },
      },
    ],
  };
  const series = [{ name: 'Bán được', data }];
  return (
    <div className="col-span-12 xl:col-span-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl dark:from-gray-800 dark:to-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-2xl font-bold text-gray-800 dark:text-white">Doanh số 7 ngày</h4>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Tổng: <span className="text-gray-900 dark:text-white">{total}</span>
        </span>
      </div>
      <ReactApexChart options={options} series={series} type="bar" height={360} />
    </div>
  );
};

export default ChartSales;

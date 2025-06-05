import React, { useState, useEffect, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ChevronDownIcon } from 'lucide-react';

const colors = ['#1E90FF', '#32CD32', '#FF4500', '#8A2BE2', '#FF1493'];

const processMonthlySalesData = (monthlySales) => {
  const yearMap = {};
  monthlySales.forEach(({ period, enrollments }) => {
    const [year, month] = period.split('-');
    if (!yearMap[year]) yearMap[year] = Array(12).fill(0);
    yearMap[year][parseInt(month, 10) - 1] = enrollments;
  });
  return yearMap;
};

const calculateMaxYValue = (dataByYear) => {
  const all = Object.values(dataByYear).flat();
  const m = Math.max(...all, 0);
  if (m <= 100) return 100;
  if (m <= 1000) return 1000;
  if (m <= 10000) return 10000;
  return Math.ceil(m / 10000) * 10000;
};

const initialOptions = {
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    toolbar: { show: false },
    dropShadow: { enabled: true, color: '#623CEA14', top: 10, blur: 4, left: 0, opacity: 0.1 },
  },
  stroke: { width: 2, curve: 'smooth' },
  dataLabels: { enabled: false },
  markers: { size: 4, colors: '#fff', strokeWidth: 3, hover: { sizeOffset: 5 } },
  xaxis: {
    type: 'category',
    categories: ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'],
    axisBorder: { show: false }, axisTicks: { show: false },
  },
  yaxis: { min: 0, max: 1000, title: { style: { fontSize: '0px' } } },
  fill: { type: 'solid', opacity: 0.3 },
  legend: { show: true, position: 'top', horizontalAlign: 'left' },
};

const YearDropdown = ({ allYears, selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const toggleYear = (year) => {
    if (selected.includes(year)) {
      onChange(selected.filter(y => y !== year));
    } else {
      onChange([...selected, year]);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        Years: {selected.join(', ') || 'All'}
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 max-h-48 w-40 overflow-y-auto rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {allYears.map(year => (
            <label key={year} className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={selected.includes(year)}
                onChange={() => toggleYear(year)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{year}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const ChartOne = ({ monthlySales }) => {
  const [dataByYear, setDataByYear] = useState({});
  const [selectedYears, setSelectedYears] = useState([]);
  const [chartData, setChartData] = useState({ series: [], options: initialOptions });

  useEffect(() => {
    const map = processMonthlySalesData(monthlySales);
    setDataByYear(map);
    const yrs = Object.keys(map).sort().reverse();
    setSelectedYears(yrs.slice(0, 3));
  }, [monthlySales]);

  useEffect(() => {
    const series = selectedYears.map((year, i) => ({
      name: year,
      data: dataByYear[year] || [],
      color: colors[i % colors.length],
    }));
    const maxY = calculateMaxYValue(dataByYear);
    setChartData({
      series,
      options: {
        ...initialOptions,
        colors: series.map(s => s.color),
        markers: { ...initialOptions.markers, strokeColors: series.map(s => s.color) },
        yaxis: { ...initialOptions.yaxis, max: maxY },
      },
    });
  }, [selectedYears, dataByYear]);

  const allYears = Object.keys(dataByYear).sort().reverse();

  return (
    <div className="col-span-12 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
          Doanh số theo tháng
        </h4>
        {allYears.length > 1 && (
          <YearDropdown
            allYears={allYears}
            selected={selectedYears}
            onChange={setSelectedYears}
          />
        )}
      </div>

      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default ChartOne;

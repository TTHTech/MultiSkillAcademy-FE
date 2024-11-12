import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const calculateMaxYValue = (data) => {
  if (!Array.isArray(data)) {
    console.error("Expected data to be an array but got:", data);
    return 100; 
  }

  const flattenedData = data.flatMap(item => item.data || []);
  const maxDataValue = Math.max(...flattenedData, 0);
  if (maxDataValue <= 100) return 100;
  if (maxDataValue <= 1000) return 1000;
  if (maxDataValue <= 10000) return 10000;
  return Math.ceil(maxDataValue / 10000) * 10000; 
};

const initialOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#1E90FF', '#32CD32', '#FF4500', '#FFA500'], 
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2, 2, 2], 
    curve: 'smooth',
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#1E90FF', '#32CD32', '#FF4500', '#FFA500'], 
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [
      'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 100, 
  },
  fill: {
    type: 'solid', 
    opacity: 0.3,
  },
};

const ChartOne = ({ data }) => {
  const [state, setState] = useState({
    series: data, 
    options: initialOptions,
  });

  useEffect(() => {
    const maxY = calculateMaxYValue(state.series);
    setState(prevState => ({
      ...prevState,
      options: {
        ...prevState.options,
        yaxis: {
          ...prevState.options.yaxis,
          max: maxY,
        },
      },
    }));
  }, [state.series]);

  return (
    <div className="col-span-12 rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:p-8 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-4 sm:flex-nowrap">
        <div className="flex flex-wrap gap-4 sm:gap-6">
          {[ 
            { color: 'bg-blue-500', text: 'Total Courses', dateRange: '12.04.2022 - 12.05.2022' }, 
            { color: 'bg-green-500', text: 'Total Sales', dateRange: '12.04.2022 - 12.05.2022' },
            { color: 'bg-orange-500', text: 'Total Views', dateRange: '12.04.2022 - 12.05.2022' },
            { color: 'bg-yellow-500', text: 'Total Students', dateRange: '12.04.2022 - 12.05.2022' }, 
          ].map(({ color, text, dateRange }) => (
            <div key={text} className="flex items-center gap-2 min-w-[120px]">
              <span className={`flex h-4 w-4 items-center justify-center rounded-full border border-${color}`}>
                <span className={`block h-2.5 w-2.5 rounded-full ${color}`}></span>
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{text}</p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{dateRange}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['Day', 'Week', 'Month'].map((label) => (
            <button
              key={label}
              className="rounded bg-gray-100 py-1 px-3 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default ChartOne;

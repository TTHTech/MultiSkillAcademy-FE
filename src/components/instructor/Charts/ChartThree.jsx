import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const options = {
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'donut',
  },
  colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF'],
  labels: ['Desktop', 'Tablet', 'Mobile', 'Unknown'],
  legend: {
    show: false,
    position: 'bottom',
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent',
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartThree = () => {
  const [state] = useState({
    series: [65, 34, 12, 56],
  });

  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white p-5 shadow-md dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-4 flex justify-between items-center">
        <h5 className="text-xl font-semibold text-black dark:text-white">Visitors Analytics</h5>
        <div className="relative inline-block">
          <select
            name=""
            id=""
            className="appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium text-gray-800 dark:text-gray-200 border rounded-md border-gray-300 dark:border-gray-700 focus:outline-none"
          >
            <option value="" className="dark:bg-boxdark">Monthly</option>
            <option value="" className="dark:bg-boxdark">Yearly</option>
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                fill="#637381"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                fill="#637381"
              />
            </svg>
          </span>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <ReactApexChart
          options={options}
          series={state.series}
          type="donut"
          width="100%"
        />
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#3C50E0]"></div>
          <p className="text-sm font-medium text-black dark:text-white">
            Desktop <span className="font-normal">65%</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#6577F3]"></div>
          <p className="text-sm font-medium text-black dark:text-white">
            Tablet <span className="font-normal">34%</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#8FD0EF]"></div>
          <p className="text-sm font-medium text-black dark:text-white">
            Mobile <span className="font-normal">12%</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#0FADCF]"></div>
          <p className="text-sm font-medium text-black dark:text-white">
            Unknown <span className="font-normal">56%</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;

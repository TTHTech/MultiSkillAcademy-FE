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

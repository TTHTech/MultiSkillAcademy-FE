import ReactApexChart from 'react-apexcharts';

const options = {
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'donut',
  },
  colors: ['#FFC107', '#FF9800', '#FF5722'], // Vàng, cam nhạt, cam đậm
  labels: ['Total Reviews', 'Good Reviews', 'Bad Reviews'],
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

const ChartThree = ({ data }) => {
  const series = [
    data.totalReview || 0,
    data.reviewGood || 0,
    data.reviewBad || 0,
  ];

  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white p-5 shadow-md dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-4 flex justify-between items-center">
        <h5 className="text-xl font-semibold text-black dark:text-white">
          Reviews Analytics
        </h5>
      </div>

      <div className="flex justify-center mb-4">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          width="100%"
        />
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#FFC107]"></div>
          <p className="text-sm font-medium text-black dark:text-white">
            Total <span className="font-normal">{data.totalReview || 0}</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#FF9800]"></div>
          <p className="text-sm font-medium text-black dark:text-white">
            Good Reviews <span className="font-normal">{data.reviewGood || 0}</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5722]"></div>
          <p className="text-sm font-medium text-black dark:text-white">
            Bad Reviews <span className="font-normal">{data.reviewBad || 0}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;

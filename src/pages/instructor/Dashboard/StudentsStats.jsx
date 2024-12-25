
const StudentsStats = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Students</h2>
      <p>Total Students: {data.totalStudent || 0}</p>
    </div>
  );
};

export default StudentsStats;

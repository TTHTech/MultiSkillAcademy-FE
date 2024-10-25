// src/pages/student/StudentHomePage.jsx


const StudentHomePage = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-indigo-600">Welcome, Student!</h1>
      <p className="text-xl text-gray-700 mb-4">
        This is your homepage. Here you can access your courses and more!
      </p>
      <button className="bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-800 transition">
        Go to Courses
      </button>
    </div>
  );
};

export default StudentHomePage;

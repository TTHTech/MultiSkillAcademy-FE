import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header/HeaderStudent";
function CourseDetail() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/student/course/CR001")
      .then((response) => {
        setCourse(response.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching course data:", error));
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!course) {
    return <div className="text-center mt-10">Course not found!</div>;
  }

  const {
    title,
    description,
    price,
    instructorFirstName,
    instructorLastName,
    instructorProfileImage,
    imageUrls,
    language,
    level,
    rating,
    duration,
    categoryName,
    status,
    sections,
  } = course;

  return (
    <div className="container mx-auto p-8">
      {/* Breadcrumb */}
      <Header/>
      <nav className="text-gray-500 mb-6">
        <ol className="list-reset flex">
          <li>
            <a href="/" className="hover:text-blue-600">
              Home
            </a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <a href="/courses" className="hover:text-blue-600">
              Courses
            </a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-900">{title}</li>
        </ol>
      </nav>

      {/* Header: Course Title and Images */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Course Images */}
        <div className="lg:w-2/3 relative">
          <img
            src={imageUrls[0]}
            alt="Course"
            className="rounded-lg shadow-lg w-full h-64 object-cover"
          />
          <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2 text-sm">
            {level} Level • {language}
          </div>
        </div>

        {/* Course Summary */}
        <div className="lg:w-1/3">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-gray-700 mb-4">{description}</p>

          <div className="flex items-center mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`text-xl cursor-pointer ${
                    index < rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  title={`${rating} out of 5`}
                >
                  ★
                </span>
              ))}
              <span className="text-gray-500 text-lg ml-2">
                ({level} level)
              </span>
            </div>
          </div>

          <p className="text-3xl font-semibold text-green-600 mb-4">${price}</p>

          {/* Category */}
          <div className="mb-4 flex justify-between">
            <p className="text-gray-600 font-semibold">Category:</p>
            <p className="text-gray-700">{categoryName}</p>
          </div>

          {/* Duration */}
          <div className="mb-4 flex justify-between">
            <p className="text-gray-600 font-semibold">Duration:</p>
            <p className="text-gray-700">{duration ? duration : "N/A"}</p>
          </div>

          {/* Status */}
          <div className="mb-4 flex justify-between">
            <p className="text-gray-600 font-semibold">Status:</p>
            <p className="text-gray-700">{status}</p>
          </div>

          {/* Created At */}
          <div className="mb-4 flex justify-between">
            <p className="text-gray-600 font-semibold">Created At:</p>
            <p className="text-gray-700">
              {new Date(course.createdAt).toLocaleDateString("en-GB")}
            </p>
          </div>

          {/* Updated At */}
          <div className="mb-4 flex justify-between">
            <p className="text-gray-600 font-semibold">Updated At:</p>
            <p className="text-gray-700">
              {new Date(course.updatedAt).toLocaleDateString("en-GB")}
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200">
              Add to Cart
            </button>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Instructor Section */}
      <div className="mt-12 flex items-center gap-6 border-t border-b py-6">
        <img
          src={instructorProfileImage}
          alt="Instructor"
          className="w-20 h-20 rounded-full object-cover shadow-lg"
        />
        <div>
          <h3 className="text-xl font-bold">
            Instructor: {instructorFirstName} {instructorLastName}
          </h3>
          <p className="text-gray-600">{language}</p>
        </div>
      </div>

      {/* Course Sections */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Course Content</h2>
        <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
          {sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
              <ul className="list-disc ml-6">
                {section.lectures.map((lecture, idx) => (
                  <li key={idx} className="text-gray-700">
                    {lecture}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;

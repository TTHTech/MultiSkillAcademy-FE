import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const CourseDetails = () => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/instructor/courses/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCourseData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (section, index, value) => {
    setCourseData((prevData) => {
      const updatedSection = [...prevData[section]];
      updatedSection[index] = value;
      return { ...prevData, [section]: updatedSection };
    });
  };

  const handleAddNew = (section) => {
    setCourseData((prevData) => {
      const updatedSection = [...prevData[section], "New Item"];
      return { ...prevData, [section]: updatedSection };
    });
  };

  const handleDelete = (section, index) => {
    setCourseData((prevData) => {
      const updatedSection = prevData[section].filter((_, i) => i !== index);
      return { ...prevData, [section]: updatedSection };
    });
  };

  const handleSave = async () => {
    const instructorCoursesDetailDTO = {
      courseId: courseData.courseId,
      categoryName: courseData.category,
      instructor: courseData.instructor,
      instructorName: courseData.instructorName,
      title: courseData.title,
      description: courseData.description,
      price: courseData.price,
      images: courseData.images,
      language: courseData.language,
      level: courseData.level,
      duration: courseData.duration,
      status: courseData.status,
      rating: courseData.rating,
      createdAt: courseData.createdAt,
      updatedAt: new Date().getTime(),
      targetAudience: courseData.targetAudience,
      courseContent: courseData.courseContent,
      resourceDescription: courseData.resourceDescription,
      requirements: courseData.requirements,
    };

    try {
      await axios.put(
        `${baseUrl}/api/instructor/update-course-detail/${courseData.courseId}`,
        instructorCoursesDetailDTO,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Course updated successfully!");
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update course: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full mx-auto p-8 bg-gray-100 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Detailed Description Information
      </h1>
      {[
        "targetAudience",
        "courseContent",
        "resourceDescription",
        "requirements",
      ].map((section) => (
        <div key={section} className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 capitalize mb-4">
            {section.replace(/([A-Z])/g, " $1")}
          </h2>

          <ul className="list-disc list-inside bg-white p-4 rounded-lg shadow-md space-y-4">
            {courseData[section].map((item, index) => (
              <li key={index} className="flex items-center">
                {isEditing ? (
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleInputChange(section, index, e.target.value)
                    }
                    className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-gray-700 flex-1">{item}</span>
                )}
                {isEditing && (
                  <button
                    onClick={() => handleDelete(section, index)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    🗑
                  </button>
                )}
              </li>
            ))}
          </ul>

          {isEditing && (
            <div className="mt-4">
              <button
                onClick={() => handleAddNew(section)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                + Add
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="mt-10 flex justify-end space-x-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={handleEditToggle}
              className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={handleEditToggle}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
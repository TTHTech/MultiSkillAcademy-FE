import { useEffect, useState } from "react";
import axios from "axios";

const CourseDetails = () => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/instructor/courses/CR001", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
        });
        setCourseData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Course Details</h1>
      <h2>Target Audience</h2>
      <ul>
        {courseData.targetAudience.map((audience, index) => (
          <li key={index}>{audience}</li>
        ))}
      </ul>

      <h2>Course Content</h2>
      <ul>
        {courseData.courseContent.map((content, index) => (
          <li key={index}>{content}</li>
        ))}
      </ul>

      <h2>Resource Description</h2>
      <ul>
        {courseData.resourceDescription.map((resource, index) => (
          <li key={index}>{resource}</li>
        ))}
      </ul>

      <h2>Requirements</h2>
      <ul>
        {courseData.requirements.map((requirement, index) => (
          <li key={index}>{requirement}</li>
        ))}
      </ul>
    </div>
  );
};

export default CourseDetails;

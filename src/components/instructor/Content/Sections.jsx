import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Lectures from "./Lectures";
const Sections = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSection, setNewSection] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const audienceContainerRef = useRef(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh((prev) => !prev);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        audienceContainerRef.current &&
        !audienceContainerRef.current.contains(e.target)
      ) {
        setSelectedSection(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/instructor/courses/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch course details");
        }
        const data = await response.json();
        setCourse(data);
        setSections(
          [...data.sections].sort((a, b) => a.sectionOrder - b.sectionOrder)
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, refresh]);

  const updateSection = async (index) => {
    const section = sections[index];
    try {
      await axios.put(
        `http://localhost:8080/api/instructor/update-section/${section.section_id}`,
        {
          sectionId: section.section_id,
          title: section.title,
          courseId: course.courseId,
          sectionOrder: section.sectionOrder,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      alert("Failed to update section: " + err.message);
    }
  };

  const updateAllSectionsOrder = async (updatedSections) => {
    const sectionsToSave = updatedSections.map((section, i) => ({
      ...section,
      sectionOrder: i + 1,
    }));
    try {
      await Promise.all(
        sectionsToSave.map((section) =>
          axios.put(
            `http://localhost:8080/api/instructor/update-section/${section.section_id}`,
            {
              sectionId: section.section_id,
              title: section.title,
              courseId: course.courseId,
              sectionOrder: section.sectionOrder,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
        )
      );
      setSections(sectionsToSave);
    } catch (err) {
      alert("Failed to update section order: " + err.message);
    }
  };

  const handleSectionChange = (index, value) => {
    const updated = [...sections];
    updated[index].title = value;
    setSections(updated);
    updateSection(index);
  };
  const handleSectionBlur = (index) => {
    if (sections[index].title.trim() === "") {
      alert("Tiêu đề không được để trống");
      const original =
        course.sections.find(
          (sec) => sec.section_id === sections[index].section_id
        )?.title || "";
      const updated = [...sections];
      updated[index].title = original;
      setSections(updated);
    } else {
      updateSection(index);
    }
  };
  const handleDelete = async (index) => {
    const section = sections[index];
    try {
      await axios.delete(
        `http://localhost:8080/api/instructor/delete-section/${section.section_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const updated = sections.filter((_, i) => i !== index);
      updateAllSectionsOrder(updated);
    } catch (err) {
      alert("Failed to delete section: " + err.message);
    }
  };
  const handleDragStart = (index, e) => {
    setDraggedIndex(index);
    const ghost = e.currentTarget.cloneNode(true);
    ghost.style.position = "absolute";
    ghost.style.top = "-1000px";
    ghost.style.opacity = "1";
    ghost.style.transform = "scale(1.05)";
    ghost.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(
      ghost,
      ghost.offsetWidth / 2,
      ghost.offsetHeight / 2
    );
    setTimeout(() => {
      document.body.removeChild(ghost);
    }, 0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedIndex === null) return;
    const updated = [...sections];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);
    setDraggedIndex(null);
    updateAllSectionsOrder(updated);
  };

  const handleAddNew = async () => {
    if (newSection.trim().length === 0) {
      alert("Tên chương không được để trống");
      return;
    }
    const newSectionObj = {
      sectionId: Date.now().toString(),
      title: newSection,
      courseId: course.courseId,
      sectionOrder: sections.length + 1,
      lectures: [],
    };
    try {
      await axios.post(
        `http://localhost:8080/api/instructor/add-section`,
        newSectionObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const updated = [...sections, newSectionObj];
      setSections(updated);
      setNewSection("");
    } catch (err) {
      alert("Failed to add section: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white-50 p-6">
      <h2 className="text-2xl font-bold mb-2">
        {selectedLecture === null
          ? "Danh sách các chương"
          : " Danh sách bài học"}
      </h2>
      {selectedLecture === null ? (
        <div ref={audienceContainerRef} className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={section.section_id}
              className={`flex items-center space-x-2 p-4 border border-gray-300 rounded bg-white transition-all duration-300 ${
                selectedSection === index
                  ? "shadow-2xl transform scale-105 border-blue-400"
                  : selectedSection !== null && selectedSection !== index
                  ? "opacity-75"
                  : ""
              }`}
              draggable
              onClick={() => setSelectedSection(index)}
              onDragStart={(e) => handleDragStart(index, e)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
            >
              <span className="font-bold text-lg">
                Chương {section.sectionOrder}:
              </span>
              <input
                type="text"
                value={section.title}
                onChange={(e) => handleSectionChange(index, e.target.value)}
                onBlur={() => handleSectionBlur(index)}
                className="flex-1 outline-none border-none text-gray-800"
                placeholder="Nhập tiêu đề chương"
              />
              <span className="border border-blue-500 text-blue-500 rounded px-2 py-1 text-sm">
                {section.sectionOrder}
              </span>
              <button
                onClick={() => handleDelete(index)}
                className="border border-red-500 text-red-500 rounded px-2 py-1 hover:bg-red-100 transition"
                title="Xóa chương"
              >
                🗑
              </button>
              <button
                className="border border-gray-500 text-gray-500 rounded px-2 py-1 hover:bg-gray-100 transition cursor-move"
                title="Kéo để thay đổi vị trí"
              >
                ☰
              </button>
              <button
                onClick={() => setSelectedLecture(index)}
                className="border border-green-500 text-green-500 rounded px-3 py-1 hover:bg-green-100 transition flex items-center"
                title="Xem bài giảng"
              >
                <span className="ml-1">
                  {section.lectures.length} Bài giảng
                </span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedLecture(null)}
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-100 transition"
          >
            ⬅ Quay lại danh sách chương
          </button>
          <Lectures
            lectures={sections[selectedLecture].lectures}
            sectionId={sections[selectedLecture].section_id}
            triggerRefresh={triggerRefresh}
          />
        </div>
      )}
      {selectedLecture === null && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Thêm Chương mới</h2>
          <p className="text-gray-500 text-sm italic mb-2">
            Hãy đảm bảo rằng tên chương được viết ngắn gọn, dể hiểu và nó đã bao
            quát nội dung các bài học trong nó.
          </p>
          <div className="flex items-center space-x-2 p-4 border border-gray-300 rounded bg-white">
            <input
              type="text"
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              className="flex-1 outline-none border-none text-gray-800"
              placeholder="Nhập tiêu đề chương mới"
            />
          </div>
          <button
            onClick={handleAddNew}
            className="mt-2 px-4 py-2 border border-green-500 text-green-500 rounded hover:bg-green-100 transition"
          >
            + Thêm chương mới
          </button>
        </div>
      )}
    </div>
  );
};

export default Sections;

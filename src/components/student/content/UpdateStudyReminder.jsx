import React, { useState, useEffect } from 'react';

const CourseEditComponent = ({ courseData }) => {
    const [course, setCourse] = useState(courseData);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCourse((prevCourse) => ({
            ...prevCourse,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSave = () => {
        console.log("Dữ liệu đã được lưu:", course);
        setIsEditing(false);
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">
                {isEditing ? "Chỉnh sửa khóa học" : "Chi tiết khóa học"}
            </h2>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-700">ID:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="id"
                            value={course.id}
                            onChange={handleChange}
                            disabled
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                        />
                    ) : (
                        <span>{course.id}</span>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-700">Tên khóa học:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="content"
                            value={course.content}
                            onChange={handleChange}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                        />
                    ) : (
                        <span>{course.content}</span>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-700">Email:</label>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={course.email}
                            onChange={handleChange}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                        />
                    ) : (
                        <span>{course.email}</span>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-700">Course ID:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="courseId"
                            value={course.courseId}
                            onChange={handleChange}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                        />
                    ) : (
                        <span>{course.courseId}</span>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-700">Frequency:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="frequency"
                            value={course.frequency}
                            onChange={handleChange}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                        />
                    ) : (
                        <span>{course.frequency}</span>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-700">Selected Days:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="selectedDays"
                            value={(course.selectedDays || []).join(", ")}  // Ensure selectedDays is always an array
                            onChange={(e) => handleChange({ ...e, value: e.target.value.split(", ") })}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                        />
                    ) : (
                        <span>{(course.selectedDays || []).join(", ")}</span> // Ensure selectedDays is always an array
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-700">Time:</label>
                    {isEditing ? (
                        <input
                            type="time"
                            name="time"
                            value={course.time ? `${course.time[0]}:${course.time[1]}` : ""}
                            onChange={(e) => handleChange({ ...e, value: e.target.value.split(":").map(Number) })}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                        />
                    ) : (
                        <span>{course.time ? `${course.time[0]}:${course.time[1]}` : ""}</span>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-700">Last Sent At:</label>
                    {isEditing ? (
                        <input
                            type="datetime-local"
                            name="lastSentAt"
                            value={course.lastSentAt || ""}
                            onChange={handleChange}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                        />
                    ) : (
                        <span>{course.lastSentAt}</span>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-700">Active:</label>
                    {isEditing ? (
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={course.isActive || false} // Ensure isActive is a boolean
                            onChange={handleChange}
                            className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
                        />
                    ) : (
                        <span>{course.isActive ? "Có" : "Không"}</span>
                    )}
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <button
                    onClick={toggleEdit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
                </button>
                {isEditing && (
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Lưu
                    </button>
                )}
            </div>
        </div>
    );
};

export default CourseEditComponent;

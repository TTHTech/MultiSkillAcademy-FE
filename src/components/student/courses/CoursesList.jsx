import React from 'react';
import CourseCard from './CourseCard';

const courses = [
  {
    title: "Viết ứng dụng bán hàng với Java Springboot/API và...",
    instructor: "Nguyen Duc Hoang",
    progress: 39,
    rating: 5,
    imageUrl: "https://th.bing.com/th/id/OIP.nYfUVcyEDf--E9wxNPFvzwAAAA?rs=1&pid=ImgDetMain",
  },
  {
    title: "Cách tạo một khóa học Udemy",
    instructor: "Udemy Instructor Team",
    progress: 10,
    rating: 4,
    imageUrl: "https://th.bing.com/th/id/OIP.nYfUVcyEDf--E9wxNPFvzwAAAA?rs=1&pid=ImgDetMain",
  },
  {
    title: "Thiết kế cơ sở dữ liệu với Oracle",
    instructor: "Nguyen Duc Hoang",
    progress: 6,
    rating: 5,
    imageUrl: "https://th.bing.com/th/id/OIP.nYfUVcyEDf--E9wxNPFvzwAAAA?rs=1&pid=ImgDetMain",
  },
  {
    title: "React và Redux cho người mới",
    instructor: "Jane Doe",
    progress: 72,
    rating: 5,
    imageUrl: "https://th.bing.com/th/id/OIP.nYfUVcyEDf--E9wxNPFvzwAAAA?rs=1&pid=ImgDetMain",
  },
  {
    title: "Kỹ năng lập trình Python",
    instructor: "John Smith",
    progress: 25,
    rating: 4,
    imageUrl: "https://th.bing.com/th/id/OIP.nYfUVcyEDf--E9wxNPFvzwAAAA?rs=1&pid=ImgDetMain",
  },
  {
    title: "Phát triển ứng dụng iOS với Swift",
    instructor: "Emily Davis",
    progress: 40,
    rating: 5,
    imageUrl: "https://th.bing.com/th/id/OIP.nYfUVcyEDf--E9wxNPFvzwAAAA?rs=1&pid=ImgDetMain",
  },
  {
    title: "Web Development với HTML, CSS, JavaScript",
    instructor: "Chris Brown",
    progress: 55,
    rating: 4,
    imageUrl: "https://th.bing.com/th/id/OIP.nYfUVcyEDf--E9wxNPFvzwAAAA?rs=1&pid=ImgDetMain",
  },
  {
    title: "Data Science với R",
    instructor: "Michael Lee",
    progress: 80,
    rating: 5,
    imageUrl: "https://th.bing.com/th/id/OIP.nYfUVcyEDf--E9wxNPFvzwAAAA?rs=1&pid=ImgDetMain",
  },
  {
    title: "Machine Learning A-Z",
    instructor: "Anna Johnson",
    progress: 15,
    rating: 5,
    imageUrl: "https://th.bing.com/th/id/OIP.nYfUVcyEDf--E9wxNPFvzwAAAA?rs=1&pid=ImgDetMain",
  },
  {
    title: "Lập trình Game với Unity",
    instructor: "Tom White",
    progress: 90,
    rating: 5,
    imageUrl: "https://th.bing.com/th/id/OIP.nYfUVcyEDf--E9wxNPFvzwAAAA?rs=1&pid=ImgDetMain",
  },
];

const CoursesList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5">
      {courses.map((course, index) => (
        <CourseCard key={index} course={course} />
      ))}
    </div>
  );
};

export default CoursesList;

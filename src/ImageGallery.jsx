import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ImageGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để xem nội dung này.');
      setLoading(false);
      return;
    }

    axios.get('http://localhost:8080/api/instructor/imageAll', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setImages(response.data);
      })
      .catch(err => {
        console.error('Error fetching images:', err);
        setError('Có lỗi khi tải hình ảnh. Vui lòng thử lại sau.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-500">Đang tải hình ảnh...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Danh sách hình ảnh khóa học</h1>
      {images.length === 0 ? (
        <p className="text-center text-gray-600">Chưa có hình ảnh nào để hiển thị.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map(img => (
            <div
              key={img.imageId}
              className="group bg-white rounded-2xl shadow-lg p-4 transition-transform transform hover:scale-105"
            >
              <div className="overflow-hidden rounded-lg border">
                <img
                  src={img.imageURL}
                  alt={`Ảnh khóa học ${img.imageId}`}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="mt-4 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Course ID:</span> {img.courseId || 'Chưa gán'}
                </p>
                <p>
                  <span className="font-semibold">Image ID:</span> {img.imageId}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Số lượng category hiển thị mỗi trang
const ITEMS_PER_PAGE = 10;

const CategoryTable = () => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: "", description: "", status: "Active" });
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("Loading categories...");

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return;
            }

            const response = await axios.get("http://localhost:8080/api/admin/categories", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:",   
 error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const filteredCategories = categories.filter((category) => 
        category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        category?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

    const currentCategories = filteredCategories.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleViewCategory = (category) => {
        setEditingCategory(category);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleAddCategoryChange = (e) => {
        const { name, value } = e.target;
        setNewCategory((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddCategorySubmit = async () => {
        // Kiểm tra dữ liệu
        if (!newCategory.name.trim() || !newCategory.description.trim()) {
            toast.error("Name and description are required!");
            return;
        }
    
        setLoadingMessage("Adding category...");
        setIsLoading(true);
    
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                toast.error("Authentication failed. Please log in again.");
                return;
            }
    
            const response = await axios.post(
                "http://localhost:8080/api/admin/categories",
                newCategory,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            // Thêm category mới vào đầu danh sách
            setCategories([response.data, ...categories]);
            setShowAddCategoryForm(false);
            setNewCategory({ name: "", description: "", status: "Active" });
            toast.success("Category added successfully!");
        } catch (error) {
            console.error("Error adding category:", error);
    
            if (error.response && error.response.status === 400) {
                toast.error("Invalid input. Please check your data.");
            } else {
                toast.error("Error adding category. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleUpdateCategorySubmit = async () => {
        if (!editingCategory?.name?.trim() || !editingCategory?.description?.trim()) {
            toast.error("Name and description are required!");
            return;
        }
    
        setLoadingMessage("Updating category...");
        setIsLoading(true);
    
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return;
            }
    
            if (!editingCategory?.categoryId) {
                console.error("Category ID is missing!");
                return;
            }
    
            const response = await axios.put(
                `http://localhost:8080/api/admin/categories/update/${editingCategory.categoryId}`,
                editingCategory,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            setCategories(categories.map((category) =>
                category.categoryId === editingCategory.categoryId ? response.data : category
            ));
            setEditingCategory(null);
            toast.success("Category updated successfully!");
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error("Error updating category!");
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleDeleteCategory = async (categoryId) => {
        setLoadingMessage("Deleting category...");
        setIsLoading(true);
        const confirmation = window.confirm("Are you sure you want to delete this category?");
        if (confirmation) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found");
                    return;
                }

                await axios.delete(`http://localhost:8080/api/admin/categories/${categoryId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setCategories(categories.filter((category) => category.categoryId !== categoryId));
                if (editingCategory?.categoryId === categoryId) setEditingCategory(null);
                toast.success("Category deleted successfully!");
            } catch (error) {
                console.error("Error deleting category:", error);
                toast.error("Error deleting category. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
    };
    return (
        <div>
            {isLoading ? (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-gray-700 p-6 rounded-lg flex flex-col items-center">
                        <Loader className="animate-spin text-white text-4xl mb-4" />
                        <span className="text-white text-lg">{loadingMessage}</span>
                    </div>
                </div>
            ) : (
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8 relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Success message */}
                    {showSuccessMessage && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg text-center">
                            {showSuccessMessage}
                        </div>
                    )}
    
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Categories</h2>
                        <div className="flex items-center">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleSearch}
                                    value={searchTerm}
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            </div>
                            <button
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg ml-4"
                                onClick={() => setShowAddCategoryForm(true)}
                            >
                                <span className="text-xl">+</span>
                            </button>
                        </div>
                    </div>
    
                    {editingCategory ? (
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-100 mb-4">Category Details</h3>
    
                            <div className="mb-4">
                                <label className="text-gray-400">Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editingCategory.name}
                                    className="w-full p-2 bg-gray-600 text-white rounded-lg"
                                    onChange={(e) =>
                                        setEditingCategory((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                />
                            </div>
    
                            <div className="mb-4">
                                <label className="text-gray-400">Description:</label>
                                <textarea
                                    name="description"
                                    value={editingCategory.description}
                                    className="w-full p-2 bg-gray-600 text-white rounded-lg"
                                    onChange={(e) =>
                                        setEditingCategory((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                />
                            </div>
    
                            <div className="mb-4">
                                <label className="text-gray-400">Status:</label>
                                <select
                                    name="status"
                                    value={editingCategory.status}
                                    className="w-full p-2 bg-gray-600 text-white rounded-lg"
                                    onChange={(e) =>
                                        setEditingCategory((prev) => ({
                                            ...prev,
                                            status: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
    
                            <div className="flex justify-between">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                    onClick={handleUpdateCategorySubmit}
                                >
                                    Update
                                </button>
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                    onClick={() => setEditingCategory(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {currentCategories.map((category) => (
                                    <div key={category.categoryId} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                                        <div>
                                            <h3 className="text-xl text-gray-100">{category.name}</h3>
                                            <p className="text-gray-400">{category.description}</p>
                                            <span className={`text-sm ${category.status === "Active" ? "text-yellow-400" : "text-red-400"}`}>
                                                {category.status}
                                            </span>
                                        </div>
    
                                        <div className="flex space-x-4">
                                        <button
                                            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md transition duration-300 ease-in-out transform hover:bg-blue-400 hover:scale-105"
                                            onClick={() => handleViewCategory(category)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md transition duration-300 ease-in-out transform hover:bg-red-400 hover:scale-105"
                                            onClick={() => handleDeleteCategory(category.categoryId)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    
                                    </div>
                                ))}
                            </div>
    
                            {/* Pagination */}
                            <div className="flex justify-center mt-6">
                                <button
                                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg mr-2"
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    Previous
                                </button>
                                <span className="text-white">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg ml-2"
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
    
                    {/* Add Category Form */}
                    {showAddCategoryForm && (
                        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-gray-700 p-6 rounded-lg w-96 shadow-lg relative">
                                <button
                                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg"
                                    onClick={() => setShowAddCategoryForm(false)}
                                >
                                    X
                                </button>
                                <h3 className="text-xl font-semibold text-gray-100 mb-4">Add Category</h3>
                    
                                <div className="mb-4">
                                    <label className="text-gray-400">Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newCategory.name}
                                        className="w-full p-2 bg-gray-600 text-white rounded-lg"
                                        onChange={handleAddCategoryChange}
                                    />
                                </div>
                    
                                <div className="mb-4">
                                    <label className="text-gray-400">Description:</label>
                                    <textarea
                                        name="description"
                                        value={newCategory.description}
                                        className="w-full p-2 bg-gray-600 text-white rounded-lg"
                                        onChange={handleAddCategoryChange}
                                    />
                                </div>
                    
                                <div className="mb-4">
                                    <label className="text-gray-400">Status:</label>
                                    <select
                                        name="status"
                                        value={newCategory.status}
                                        className="w-full p-2 bg-gray-600 text-white rounded-lg"
                                        onChange={handleAddCategoryChange}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                    
                                <div className="flex justify-between">
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg"
                                        onClick={handleAddCategorySubmit}
                                    >
                                        Add Category
                                    </button>
                                    <button
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                        onClick={() => setShowAddCategoryForm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                </motion.div>
            )}
        </div>
    );
};

export default CategoryTable;

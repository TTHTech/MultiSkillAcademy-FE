
import Header from "../components/common/Header";



import CreateUserForm from "../components/AddNewUser/CreateUserForm";



const AddNewUserPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Add New Instructor" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
       

        {/* Form để tạo người dùng mới */}
        <CreateUserForm />


      </main>
    </div>
  );
};

export default AddNewUserPage;

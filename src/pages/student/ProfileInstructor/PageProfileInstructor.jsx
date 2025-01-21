import InstructorProfile from "../../../components/student/ProfileInstrructor/ProfileInstructor";
import Footer from "../../../components/student/common/Footer";
import NavBar from "../../../components/student/common/NavBar";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const InstructorPage = () => {
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);  
  }, []);
  return (
    <>
      <NavBar />
      <main className="bg-white min-h-screen pt-16 pb-8">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="bg-white p-8 mb-12">
            <InstructorProfile id={id} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default InstructorPage;

import Reminder from "../../../components/student/reminder/Reminder";
import Footer from "../../../components/student/common/Footer";
import NavBar from "../../../components/student/common/NavBar";

const ReminderPage = () => {
  return (
    <>
      <NavBar />
      <main className="bg-gray-50 min-h-screen flex flex-col items-center py-16 px-6">
        <div className="max-w-5xl w-full rounded-xl p-8">
          <Reminder />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ReminderPage;

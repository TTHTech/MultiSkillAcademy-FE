import { useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi'; 

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="font-poppins bg-gradient-to-b from-red-200 to-blue-200 text-black px-4 py-2 rounded-lg shadow-md hover:from-green-300 hover:to-blue-300 focus:outline-none transition duration-300 flex items-center"
      >
        <BiArrowBack className="mr-2" /> 
        <span>Quay lại</span>
      </button>
    </div>
  );
};

export default BackButton;

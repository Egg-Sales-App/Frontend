import { useNavigate } from "react-router-dom";

const StoreSelector = () => {
  const navigate = useNavigate();

  const handleSelect = (store) => {
    navigate(`/pos/${store}/dashboard`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-6 font-bold">Select Store</h2>
      <div className="space-y-4">
        <button onClick={() => handleSelect("equipment")} className="px-6 py-3 bg-blue-500 text-white rounded">
          Equipment Store
        </button>
        <button onClick={() => handleSelect("feeds")} className="px-6 py-3 bg-green-500 text-white rounded">
          Feeds & Eggs Store
        </button>
      </div>
    </div>
  );
};

export default StoreSelector;

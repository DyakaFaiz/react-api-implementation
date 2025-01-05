import { useNavigate } from "react-router-dom";
import throttle from "lodash.throttle";

const Sidebar = () => {
  const navigate = useNavigate();

  const throttledNavigate = throttle((path) => {
    navigate(path);
  }, 1000);

  return (
    <aside className="w-64 bg-slate-500 text-white min-h-screen">
      <div className="p-4 flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <nav>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => throttledNavigate("/admin")}
                className="hover:text-gray-300 text-left w-full"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => throttledNavigate("/admin/mahasiswa")}
                className="hover:text-gray-300 text-left w-full"
              >
                Mahasiswa
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
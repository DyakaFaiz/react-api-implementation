import { useState, useEffect } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError("An error occurred while fetching data" + error);
        setLoading(false);

      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="p-6">
      <h1 className="font-bold text-lg mb-4">Halaman Post</h1>
      <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">No</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Body</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{item.title}</td>
              <td className="border px-4 py-2">{item.body}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
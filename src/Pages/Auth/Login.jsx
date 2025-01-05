import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/AuthSlice";
import throttle from "lodash.throttle";


const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isThrottling, setIsThrottling] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let delayThrottling = 3000;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const throttledLogin = throttle(async (data) => {
    try {
      const response = await axios.post("/api/login", data);
      if (response.status === 200) {
        const { user, token } = response.data.data;
        
        // Simpan ke Redux
        dispatch(login({ user, token }));
  
        // Simpan ke localStorage agar data bertahan setelah refresh
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
  
        navigate("/admin");
      }
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    }
  }, delayThrottling);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isThrottling) {
      setError("Please wait before trying again.");
      return;
    }

    setIsThrottling(true);
    setError(null);

    throttledLogin(formData);

    setTimeout(() => {
      setIsThrottling(false);
    }, delayThrottling);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-lg font-bold mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border px-4 py-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border px-4 py-2 rounded w-full"
              required
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded w-full">
            Login
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
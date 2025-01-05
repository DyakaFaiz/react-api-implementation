import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom"; // Hapus BrowserRouter
import RouteList from "./RouteList"; // Import konfigurasi routing
import { Provider } from "react-redux";
import Store from "./redux/Store"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={Store}>
      <RouterProvider router={RouteList} />
    </Provider>
  </StrictMode>
);
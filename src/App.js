// Main frontend react app file containing all controls and routes

import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { themeSettings } from "theme";
import Dashboard from "pages/dashboard";
import Layout from "pages/Layout";
import Products from "pages/Products";
import NewProduct from "pages/NewProduct";
import EditProduct from "pages/EditProduct";
import Customers from "pages/Customers";
import NewCustomer from "pages/NewCustomer";
import EditCustomer from "pages/EditCustomer";
import Orders from "pages/Orders";
import NewOrder from "pages/NewOrder";
import EditOrder from "pages/EditOrder";
import Login from "pages/Login";
import ProfileUpdate from "components/ProfileUpdate";

// Function that ensures private pages are only visible after a sucessful login and token are applied
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* Public Route for Login Access*/}
            <Route path="/login" element={<Login />} />

            {/* Private Routes available after succesful login */}
            <Route element={<Layout />}>
              <Route path="/" element={<PrivateRoute><Navigate to="/dashboard" replace /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
              <Route path="/products/edit/:id" element={<PrivateRoute><EditProduct /></PrivateRoute>} />
              <Route path="/products/new" element={<PrivateRoute><NewProduct /></PrivateRoute>} />
              <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
              <Route path="/customers/new" element={<PrivateRoute><NewCustomer /></PrivateRoute>} />
              <Route path="/customers/edit/:id" element={<PrivateRoute><EditCustomer /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
              <Route path="/orders/new" element={<PrivateRoute><NewOrder /></PrivateRoute>} />
              <Route path="orders/edit/:id" element={<PrivateRoute><EditOrder /></PrivateRoute>} />
              <Route path="/profileupdate" element={<PrivateRoute><ProfileUpdate /></PrivateRoute>} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

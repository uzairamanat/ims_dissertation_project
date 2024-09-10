import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Dashboard from "pages/Dashboard";
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



function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />
              <Route path="/products/new" element={<NewProduct />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/new" element={<NewCustomer />} />
              <Route path="/customers/edit/:id" element={<EditCustomer />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/new" element={<NewOrder />} />
              <Route path="orders/edit/:id" element={<EditOrder />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

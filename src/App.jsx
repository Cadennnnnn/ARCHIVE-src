import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Home from "./pages/store/Home.jsx";
import Products from "./pages/store/Products.jsx";
import ProductDetail from "./pages/store/ProductDetail.jsx";
import Categories from "./pages/store/Categories.jsx";
import Offers from "./pages/store/Offers.jsx";

function Pendiente({ nombre }) {
  return (
    <main className="container my-5 flex-grow-1">
      <h1 className="display-5 fw-bolder">{nombre}</h1>
      <p className="text-muted">Página pendiente de migrar.</p>
    </main>
  );
}

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/ofertas" element={<Offers />} />
        <Route path="/login" element={<Pendiente nombre="LOGIN" />} />
        <Route path="/carrito" element={<Pendiente nombre="CARRITO" />} />
        <Route path="*" element={<Pendiente nombre="404" />} />
      </Routes>
      <Footer />
    </div>
  );
}
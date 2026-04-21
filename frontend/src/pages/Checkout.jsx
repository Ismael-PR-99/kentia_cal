import Navbar from "../components/Navbar.jsx";

export default function Checkout() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-950 mb-4">Checkout</h1>
        <div className="card">
          <p className="text-gray-700">Pagina protegida para usuarios autenticados.</p>
        </div>
      </div>
    </>
  );
}

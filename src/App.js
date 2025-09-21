import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CustomerList from "./components/CustomerList";
import CustomerForm from "./components/CustomerForm";
import CustomerProfile from "./components/CustomerProfile";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Customer Manager</h1>
          <nav className="space-x-4">
            <Link to="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <Link to="/create" className="text-blue-600 hover:underline">
              New Customer
            </Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<CustomerList />} />
          <Route path="/create" element={<CustomerForm />} />
          <Route path="/customer/:id" element={<CustomerProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pin
    ) {
      return "All fields are required!";
    }
    if (!/^\d{10}$/.test(form.phone)) return "Phone must be 10 digits";
    if (!/^\d{6}$/.test(form.pin)) return "PIN must be 6 digits";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");

    const res = await fetch("http://localhost:3000/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSuccess("Customer created successfully!");
      setTimeout(() => navigate("/"), 1500);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create New Customer</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        {[
          "firstName",
          "lastName",
          "phone",
          "address",
          "city",
          "state",
          "pin",
        ].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full border rounded p-2"
          />
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
}

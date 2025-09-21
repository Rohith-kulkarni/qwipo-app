import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [editing, setEditing] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    line1: "",
    city: "",
    state: "",
    pin: "",
  });

  // Fetch customer + addresses
  useEffect(() => {
    fetch(`http://localhost:3000/customers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCustomer(data);
        setAddresses(data.addresses || []);
      });
  }, [id]);

  // Update customer info
  const handleUpdate = async () => {
    await fetch(`http://localhost:3000/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });
    setEditing(false);
  };

  // Delete customer
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      await fetch(`http://localhost:3000/customers/${id}`, {
        method: "DELETE",
      });
      navigate("/");
    }
  };

  // Add address
  const handleAddAddress = async () => {
    if (
      !newAddress.line1 ||
      !newAddress.city ||
      !newAddress.state ||
      !/^\d{6}$/.test(newAddress.pin)
    ) {
      alert("Please fill valid address details");
      return;
    }
    const res = await fetch(`http://localhost:3000/customers/${id}/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAddress),
    });
    const addr = await res.json();
    setAddresses([...addresses, addr]);
    setNewAddress({ line1: "", city: "", state: "", pin: "" });
  };

  // Update address
  const handleUpdateAddress = async (addr) => {
    await fetch(`http://localhost:3000/addresses/${addr.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addr),
    });
    setAddresses(addresses.map((a) => (a.id === addr.id ? addr : a)));
  };

  // Delete address
  const handleDeleteAddress = async (addrId) => {
    if (window.confirm("Delete this address?")) {
      await fetch(`http://localhost:3000/addresses/${addrId}`, {
        method: "DELETE",
      });
      setAddresses(addresses.filter((a) => a.id !== addrId));
    }
  };

  // Mark as only one address
  const markSingleAddress = (addrId) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        onlyOne: a.id === addrId,
      }))
    );
  };

  if (!customer) return <p>Loading...</p>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Customer Profile</h2>

      {/* Customer Info */}
      {editing ? (
        <div className="space-y-2">
          {["firstName", "lastName", "phone"].map((field) => (
            <input
              key={field}
              type="text"
              value={customer[field]}
              onChange={(e) =>
                setCustomer({ ...customer, [field]: e.target.value })
              }
              className="w-full border rounded p-2"
            />
          ))}
          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white px-3 py-1 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="bg-gray-600 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <p>
            <b>Name:</b> {customer.firstName} {customer.lastName}
          </p>
          <p>
            <b>Phone:</b> {customer.phone}
          </p>
          <div className="mt-4 space-x-2">
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Addresses */}
      <h3 className="text-lg font-semibold mt-6 mb-2">Addresses</h3>
      {addresses.length === 0 && <p>No addresses found.</p>}
      {addresses.map((addr) => (
        <div key={addr.id} className="border rounded p-3 mb-3">
          <input
            type="text"
            value={addr.line1}
            onChange={(e) =>
              setAddresses(
                addresses.map((a) =>
                  a.id === addr.id ? { ...a, line1: e.target.value } : a
                )
              )
            }
            className="w-full border rounded p-2 mb-1"
          />
          <div className="grid grid-cols-3 gap-2 mb-1">
            <input
              type="text"
              value={addr.city}
              onChange={(e) =>
                setAddresses(
                  addresses.map((a) =>
                    a.id === addr.id ? { ...a, city: e.target.value } : a
                  )
                )
              }
              className="border rounded p-2"
            />
            <input
              type="text"
              value={addr.state}
              onChange={(e) =>
                setAddresses(
                  addresses.map((a) =>
                    a.id === addr.id ? { ...a, state: e.target.value } : a
                  )
                )
              }
              className="border rounded p-2"
            />
            <input
              type="text"
              value={addr.pin}
              onChange={(e) =>
                setAddresses(
                  addresses.map((a) =>
                    a.id === addr.id ? { ...a, pin: e.target.value } : a
                  )
                )
              }
              className="border rounded p-2"
            />
          </div>
          <div className="space-x-2">
            <button
              onClick={() => handleUpdateAddress(addr)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => handleDeleteAddress(addr.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => markSingleAddress(addr.id)}
              className={`px-3 py-1 rounded ${
                addr.onlyOne ? "bg-blue-700 text-white" : "bg-gray-300"
              }`}
            >
              {addr.onlyOne ? "Only One Address" : "Mark as Single"}
            </button>
          </div>
        </div>
      ))}

      {/* Add new address */}
      <h4 className="text-md font-semibold mt-4 mb-2">Add New Address</h4>
      <div className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="Address Line"
          value={newAddress.line1}
          onChange={(e) =>
            setNewAddress({ ...newAddress, line1: e.target.value })
          }
          className="w-full border rounded p-2"
        />
        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="City"
            value={newAddress.city}
            onChange={(e) =>
              setNewAddress({ ...newAddress, city: e.target.value })
            }
            className="border rounded p-2"
          />
          <input
            type="text"
            placeholder="State"
            value={newAddress.state}
            onChange={(e) =>
              setNewAddress({ ...newAddress, state: e.target.value })
            }
            className="border rounded p-2"
          />
          <input
            type="text"
            placeholder="PIN"
            value={newAddress.pin}
            onChange={(e) =>
              setNewAddress({ ...newAddress, pin: e.target.value })
            }
            className="border rounded p-2"
          />
        </div>
        <button
          onClick={handleAddAddress}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Address
        </button>
      </div>
    </div>
  );
}

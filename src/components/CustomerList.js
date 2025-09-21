import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({ city: "", state: "", pin: "" });
  const [page, setPage] = useState(1);
  const limit = 5;

  const fetchCustomers = async () => {
    // Base API call
    const res = await fetch(
      `http://localhost:3000/customers?_page=${page}&_limit=${limit}&_expand=addresses`
    );
    const data = await res.json();

    // Client-side filter (checks both customer and addresses)
    const filtered = data.filter((c) => {
      const matchesCity = filters.city
        ? c.city?.toLowerCase().includes(filters.city.toLowerCase()) ||
          c.addresses?.some((a) =>
            a.city.toLowerCase().includes(filters.city.toLowerCase())
          )
        : true;

      const matchesState = filters.state
        ? c.state?.toLowerCase().includes(filters.state.toLowerCase()) ||
          c.addresses?.some((a) =>
            a.state.toLowerCase().includes(filters.state.toLowerCase())
          )
        : true;

      const matchesPin = filters.pin
        ? c.pin?.includes(filters.pin) ||
          c.addresses?.some((a) => a.pin.includes(filters.pin))
        : true;

      return matchesCity && matchesState && matchesPin;
    });

    setCustomers(filtered);
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, [page, filters]);

  const clearFilters = () => setFilters({ city: "", state: "", pin: "" });

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Customer List</h2>

      {/* Search Filters */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <input
          className="border rounded p-2"
          placeholder="City"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="State"
          value={filters.state}
          onChange={(e) => setFilters({ ...filters, state: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Pin"
          value={filters.pin}
          onChange={(e) => setFilters({ ...filters, pin: e.target.value })}
        />
      </div>
      <button
        onClick={clearFilters}
        className="mb-4 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
      >
        Clear Filters
      </button>

      {/* Table */}
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Addresses</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="border-t align-top">
              <td className="p-2">{c.id}</td>
              <td className="p-2">
                {c.firstName} {c.lastName}
              </td>
              <td className="p-2">
                {c.addresses && c.addresses.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {c.addresses.map((a) => (
                      <li key={a.id} className="text-sm">
                        {a.line1}, {a.city}, {a.state}, {a.pin}{" "}
                        {a.onlyOne && (
                          <span className="text-blue-600 font-semibold">
                            (Only One)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500">No addresses</span>
                )}
              </td>
              <td className="p-2">
                <Link
                  to={`/customer/${c.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="font-medium">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

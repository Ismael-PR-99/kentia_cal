import { useEffect, useMemo, useState } from "react";
import { createUser, deleteUser, listUsers, updateUser } from "../lib/api.js";

const emptyForm = {
  email: "",
  first_name: "",
  last_name: "",
  role: "EMPLOYEE",
  is_active: true,
  password: ""
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listUsers();
      setUsers(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message || "No se pudo cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = { ...form };
      if (!payload.password) {
        delete payload.password;
      }
      await createUser(payload);
      setForm(emptyForm);
      await loadUsers();
    } catch (err) {
      setError(err.message || "No se pudo crear usuario");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (user) => {
    try {
      await updateUser(user.id, { is_active: !user.is_active });
      await loadUsers();
    } catch (err) {
      setError(err.message || "No se pudo actualizar usuario");
    }
  };

  const handleDelete = async (user) => {
    if (!confirm(`Eliminar a ${user.email}?`)) return;
    try {
      await deleteUser(user.id);
      await loadUsers();
    } catch (err) {
      setError(err.message || "No se pudo eliminar usuario");
    }
  };

  const rows = useMemo(() => users, [users]);

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-slate-800">Crear usuario</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="rounded-md border border-slate-300 px-3 py-2"
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="rounded-md border border-slate-300 px-3 py-2"
          />
          <input
            name="first_name"
            type="text"
            placeholder="Nombre"
            value={form.first_name}
            onChange={handleChange}
            className="rounded-md border border-slate-300 px-3 py-2"
          />
          <input
            name="last_name"
            type="text"
            placeholder="Apellido"
            value={form.last_name}
            onChange={handleChange}
            className="rounded-md border border-slate-300 px-3 py-2"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
            <option value="EMPLOYEE">EMPLOYEE</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              name="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={handleChange}
            />
            Activo
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 rounded-md bg-slate-800 text-white py-2 font-medium hover:bg-slate-900 disabled:opacity-60"
          >
            {submitting ? "Guardando..." : "Crear usuario"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Usuarios</h2>
          <button
            onClick={loadUsers}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Recargar
          </button>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Cargando...</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Nombre</th>
                  <th className="px-3 py-2 text-left">Rol</th>
                  <th className="px-3 py-2 text-left">Activo</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-3 py-2">{user.email}</td>
                    <td className="px-3 py-2">{user.first_name} {user.last_name}</td>
                    <td className="px-3 py-2">{user.role}</td>
                    <td className="px-3 py-2">
                      <span className={user.is_active ? "text-emerald-600" : "text-slate-400"}>
                        {user.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        onClick={() => handleToggle(user)}
                        className="text-xs px-3 py-1 rounded-md border border-slate-300 hover:bg-slate-100"
                      >
                        {user.is_active ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-xs px-3 py-1 rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { createPatient, deletePatient, listPatients, updatePatient } from "../lib/api.js";

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  birth_date: "",
  clinical_notes: "",
  is_active: true
};

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadPatients = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listPatients();
      setPatients(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message || "No se pudo cargar pacientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleEdit = (patient) => {
    setEditingId(patient.id);
    setForm({
      first_name: patient.first_name,
      last_name: patient.last_name,
      email: patient.email,
      phone: patient.phone || "",
      birth_date: patient.birth_date,
      clinical_notes: patient.clinical_notes || "",
      is_active: patient.is_active
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (editingId) {
        await updatePatient(editingId, form);
      } else {
        await createPatient(form);
      }
      resetForm();
      await loadPatients();
    } catch (err) {
      setError(err.message || "No se pudo guardar el paciente");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (patient) => {
    try {
      await updatePatient(patient.id, { is_active: !patient.is_active });
      await loadPatients();
    } catch (err) {
      setError(err.message || "No se pudo actualizar paciente");
    }
  };

  const handleDelete = async (patient) => {
    if (!confirm(`Dar de baja a ${patient.first_name} ${patient.last_name}?`)) return;
    try {
      await deletePatient(patient.id);
      await loadPatients();
    } catch (err) {
      setError(err.message || "No se pudo eliminar paciente");
    }
  };

  const rows = useMemo(() => patients, [patients]);

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? "Editar paciente" : "Alta de paciente"}
            </h2>
            <p className="text-sm text-slate-500">Completa la ficha clínica del paciente.</p>
          </div>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Cancelar edición
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Nombre</label>
            <input
              name="first_name"
              type="text"
              placeholder="Nombre"
              value={form.first_name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Apellidos</label>
            <input
              name="last_name"
              type="text"
              placeholder="Apellidos"
              value={form.last_name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Teléfono</label>
            <input
              name="phone"
              type="text"
              placeholder="Teléfono"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Fecha de nacimiento</label>
            <input
              name="birth_date"
              type="date"
              value={form.birth_date}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                name="is_active"
                type="checkbox"
                checked={form.is_active}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300"
              />
              Activo
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Observaciones clínicas</label>
            <textarea
              name="clinical_notes"
              placeholder="Observaciones clínicas"
              value={form.clinical_notes}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 rounded-lg bg-slate-900 text-white py-2.5 font-medium hover:bg-slate-800 disabled:opacity-60 transition"
          >
            {submitting ? "Guardando..." : editingId ? "Guardar cambios" : "Crear paciente"}
          </button>
        </form>
        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Pacientes</h2>
            <p className="text-sm text-slate-500">Listado general de pacientes.</p>
          </div>
          <button
            onClick={loadPatients}
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
                  <th className="px-3 py-3 text-left">Nombre</th>
                  <th className="px-3 py-3 text-left">Email</th>
                  <th className="px-3 py-3 text-left">Teléfono</th>
                  <th className="px-3 py-3 text-left">Alta</th>
                  <th className="px-3 py-3 text-left">Activo</th>
                  <th className="px-3 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-slate-50">
                    <td className="px-3 py-3 font-medium text-slate-900">
                      {patient.first_name} {patient.last_name}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{patient.email}</td>
                    <td className="px-3 py-3 text-slate-600">{patient.phone || "-"}</td>
                    <td className="px-3 py-3 text-slate-600">{patient.created_at?.slice(0, 10)}</td>
                    <td className="px-3 py-3">
                      <span className={patient.is_active ? "text-emerald-600 font-medium" : "text-slate-400"}>
                        {patient.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(patient)}
                        className="text-xs px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggle(patient)}
                        className="text-xs px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100"
                      >
                        {patient.is_active ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        onClick={() => handleDelete(patient)}
                        className="text-xs px-3 py-1.5 rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Baja
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

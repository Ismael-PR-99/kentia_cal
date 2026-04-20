export default function PatientPortal() {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Solicitar cita</h2>
            <p className="text-sm text-slate-500">Elige tu especialidad y preferencia horaria.</p>
          </div>
        </div>
        <form className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Especialidad</label>
            <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
              <option>Fisioterapia</option>
              <option>Rehabilitación</option>
              <option>Masaje terapéutico</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Preferencia horaria</label>
            <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
              <option>Mañana</option>
              <option>Tarde</option>
              <option>Indiferente</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Fecha preferida</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Motivo de la consulta</label>
            <input
              type="text"
              placeholder="Dolor lumbar, rehabilitación, etc."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Notas adicionales</label>
            <textarea
              rows={3}
              placeholder="Añade cualquier detalle importante"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <button
            type="button"
            className="md:col-span-2 rounded-lg bg-slate-900 text-white py-2.5 font-medium hover:bg-slate-800 transition"
          >
            Enviar solicitud
          </button>
        </form>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Mis próximas citas</h2>
        <p className="text-sm text-slate-500 mt-1">
          Aquí verás tus citas confirmadas con el especialista.
        </p>
        <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-500">
          Aún no tienes citas programadas.
        </div>
      </section>
    </div>
  );
}

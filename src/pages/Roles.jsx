import { useState } from "react";
import RolesForm from "./RolesForm";
import { FaEdit } from "react-icons/fa";

const Roles = () => {
  const [roles, setRoles] = useState([
    { id: 1, nombre: "Administrador", descripcion: "Acceso total", estado: "Activo" },
    { id: 2, nombre: "Usuario", descripcion: "Acceso limitado", estado: "Activo" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [rolEdit, setRolEdit] = useState(null);

  const handleSave = (rol) => {
    if (rolEdit) {
      // Editar
      setRoles((prev) => prev.map((r) => (r.id === rol.id ? rol : r)));
    } else {
      // Crear
      setRoles((prev) => [...prev, rol]);
    }

    setShowForm(false);
    setRolEdit(null);
  };

  const handleEdit = (rol) => {
    setRolEdit(rol);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setRolEdit(null);
  };

  return (
    <div>
      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setRolEdit(null);
          setShowForm(true);
        }}
      >
        Crear Rol
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.nombre}</td>
              <td>{r.descripcion}</td>
              <td>{r.estado}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(r)}
                >
                  <FaEdit /> Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <RolesForm
          onClose={handleCloseForm}
          onSave={handleSave}
          rolEdit={rolEdit}
        />
      )}
    </div>
  );
};

export default Roles;

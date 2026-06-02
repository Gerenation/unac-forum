export default function Field({ id, label, children }) {
  return (
    <div className="campo-formulario">
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}

import useAsesoriaStore from '../store/asesoriaStore';

const MisAsesorias = () => {
  const misAsesorias = useAsesoriaStore((state) => state.misAsesorias);

  return (
    <div>
      <h2>Mis Asesorías</h2>
      {misAsesorias.map((a) => (
        <div key={a.id}>
          <h3>{a.titulo}</h3>
          <p>{a.descripcion}</p>
        </div>
      ))}
    </div>
  );
};

export default MisAsesorias;

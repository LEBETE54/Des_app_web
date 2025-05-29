import { create } from 'zustand';

const useAsesoriaStore = create((set) => ({
  asesorias: [],
  misAsesorias: [],
  agregarAsesoria: (asesoria) =>
    set((state) => ({ asesorias: [...state.asesorias, asesoria] })),
  unirseAsesoria: (id) =>
    set((state) => {
      const asesoria = state.asesorias.find((a) => a.id === id);
      if (asesoria && !state.misAsesorias.includes(asesoria)) {
        return { misAsesorias: [...state.misAsesorias, asesoria] };
      }
      return state;
    }),
}));
export default useAsesoriaStore;

import { useState, useEffect } from 'react';
import { uploadImage } from '../uploadImage';
import { ImageIcon, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CategoryForm({ categoryToEdit, onSave, onClose }) {
  const [loading, setLoading] = useState(false);
  const [archivo, setArchivo] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    imagen_url: ''
  });

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        nombre: categoryToEdit.nombre || '',
        imagen_url: categoryToEdit.imagen_url || ''
      });
    }
  }, [categoryToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return toast.error("El nombre es obligatorio");

    setLoading(true);
    try {
      let urlFinal = formData.imagen_url;

      if (archivo) {
        urlFinal = await uploadImage(archivo);
        if (!urlFinal) throw new Error("Error al subir imagen");
      }

      await onSave({
        ...formData,
        imagen_url: urlFinal,
      });
      
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al guardar la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Categoría</label>
        <input 
          type="text"
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-500 outline-none transition"
          placeholder="Ej: Ramos de Rosas"
          value={formData.nombre}
          onChange={e => setFormData({...formData, nombre: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
          <input 
            type="file" 
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={e => setArchivo(e.target.files[0])}
          />
          <div className="flex flex-col items-center justify-center text-gray-500">
            {archivo ? (
              <span className="text-green-600 font-medium">{archivo.name}</span>
            ) : formData.imagen_url ? (
               <>
                 <img src={formData.imagen_url} alt="Preview" className="h-20 object-contain mb-2 rounded" />
                 <span className="text-xs">Click para cambiar imagen</span>
               </>
            ) : (
              <>
                <ImageIcon className="mb-2" />
                <span className="text-sm">Sube una foto</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button 
          type="button" 
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}

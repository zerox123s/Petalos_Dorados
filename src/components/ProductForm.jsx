import { useState, useEffect } from 'react';
import { uploadImage } from '../uploadImage';
import { ImageIcon, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductForm({ productToEdit, categories, onSave, onClose }) {
  const [loading, setLoading] = useState(false);
  const [archivo, setArchivo] = useState(null);
  
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    categoria_id: '',
    imagen_url: ''
  });

  // Si nos pasan un producto (Modo Edición), rellenamos el form
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        nombre: productToEdit.nombre || '',
        precio: productToEdit.precio || '',
        descripcion: productToEdit.descripcion || '',
        categoria_id: productToEdit.categoria_id || '',
        imagen_url: productToEdit.imagen_url || ''
      });
    }
  }, [productToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. VALIDACIONES
    if (!formData.nombre.trim()) return toast.error("El nombre es obligatorio");
    if (!formData.precio || formData.precio <= 0) return toast.error("El precio debe ser mayor a 0");
    if (!formData.categoria_id) return toast.error("Selecciona una categoría");

    setLoading(true);
    try {
      let urlFinal = formData.imagen_url;

      // 2. Subir imagen nueva SI el usuario seleccionó una
      if (archivo) {
        urlFinal = await uploadImage(archivo);
        if (!urlFinal) throw new Error("Error al subir imagen");
      }

      // 3. Pasar datos limpios al padre
      await onSave({
        ...formData,
        imagen_url: urlFinal,
        precio: parseFloat(formData.precio)
      });
      
      onClose(); // Cerrar modal si todo salió bien
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del arreglo</label>
        <input 
          type="text"
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-500 outline-none transition"
          placeholder="Ej: Ramo de 12 Rosas"
          value={formData.nombre}
          onChange={e => setFormData({...formData, nombre: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio (S/.)</label>
          <input 
            type="number"
            step="0.01"
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
            placeholder="0.00"
            value={formData.precio}
            onChange={e => setFormData({...formData, precio: e.target.value})}
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select 
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-500 outline-none bg-white"
            value={formData.categoria_id}
            onChange={e => setFormData({...formData, categoria_id: e.target.value})}
          >
            <option value="">Seleccionar...</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea 
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
          rows="3"
          placeholder="Detalles del producto..."
          value={formData.descripcion}
          onChange={e => setFormData({...formData, descripcion: e.target.value})}
        />
      </div>

      {/* Input de Imagen */}
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

      {/* Botones de Acción */}
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
          className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
          {productToEdit ? 'Guardar Cambios' : 'Crear Producto'}
        </button>
      </div>
    </form>
  );
}
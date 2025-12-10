import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import { uploadImage } from '../uploadImage';
import {
  Package, Tags, Settings, LogOut, Menu, Edit, Trash2, Plus, Store,
  Eye, EyeOff, Save, Image, DollarSign, FileCheck2, Instagram, Facebook, X, Link, Phone
} from 'lucide-react'
import toast from 'react-hot-toast'

import Modal from '../components/Modal'
import ProductForm from '../components/ProductForm'
import CategoryForm from '../components/CategoryForm'
import ConfirmationModal from '../components/ConfirmationModal'

// --- Componentes de UI ---
const ImageUploadInput = ({ file, onFileChange }) => (
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:bg-gray-50 transition cursor-pointer relative h-full flex flex-col justify-center">
    <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => onFileChange(e.target.files[0])} />
    <div className="flex flex-col items-center justify-center text-gray-500">
      {file ? (<><FileCheck2 className="mx-auto text-green-500" /><span className="text-xs mt-1 text-green-600 font-bold">{file.name}</span></>) : (<><Image className="mx-auto" /><span className="text-xs mt-1">Subir foto</span></>)}
    </div>
  </div>
);

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-6">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    <div><p className="text-sm font-medium text-gray-500">{title}</p><p className="text-3xl font-bold text-gray-800">{value}</p></div>
  </div>
);

const TabButton = ({ isActive, onClick, icon, label }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${isActive ? 'bg-pink-50 text-pink-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
    {icon} {label}
  </button>
);


export default function Dashboard() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('productos')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState(null)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState(null)
  const [confirmModalState, setConfirmModalState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { } });

  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [datosNegocio, setDatosNegocio] = useState({})
  const [redesSociales, setRedesSociales] = useState([])

  const [newCategoryData, setNewCategoryData] = useState({ nombre: '' })
  const [newCategoryFile, setNewCategoryFile] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return navigate('/login')
      cargarDatos()
    }
    init()
  }, [])

  const cargarDatos = async () => {
    const { data: prods } = await supabase.from('productos').select('*, categorias(nombre)').order('created_at', { ascending: false })
    const { data: cats } = await supabase.from('categorias').select('*').order('created_at', { ascending: true })
    const { data: neg } = await supabase.from('negocio').select('*').single()
    const { data: redes } = await supabase.from('redes_sociales').select('*').order('created_at', { ascending: true })
    if (prods) setProductos(prods)
    if (cats) setCategorias(cats)
    if (neg) setDatosNegocio(neg)
    if (redes) setRedesSociales(redes)
  }

  // --- Handlers ---
  const handleOpenCreateProduct = () => { setProductToEdit(null); setIsProductModalOpen(true); }
  const handleOpenEditProduct = (producto) => { setProductToEdit(producto); setIsProductModalOpen(true); }
  const handleSaveProduct = async (formData) => {
    const { error } = productToEdit ? await supabase.from('productos').update(formData).eq('id', productToEdit.id) : await supabase.from('productos').insert([formData]);
    if (error) { toast.error("Error: " + error.message); throw new Error(error.message); }
    toast.success(productToEdit ? "Producto actualizado" : "Producto creado");
    cargarDatos();
  }
  const handleDeleteProduct = (id) => { setConfirmModalState({ isOpen: true, title: 'Eliminar Producto', message: '¿Estás seguro? Esta acción es permanente.', onConfirm: async () => { await supabase.from('productos').delete().eq('id', id); toast.success("Producto eliminado"); cargarDatos(); } }); }
  const handleToggleStatus = async (id, currentStatus) => {
    await supabase.from('productos').update({ activo: !currentStatus }).eq('id', id);
    toast.success(currentStatus ? "Producto desactivado" : "Producto activado");
    cargarDatos();
  }
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryData.nombre.trim()) return toast.error('El nombre es obligatorio');
    const loadingToast = toast.loading('Creando...');
    try {
      let finalUrl = '';
      if (newCategoryFile) {
        finalUrl = await uploadImage(newCategoryFile);
        if (!finalUrl) throw new Error("Error al subir imagen");
      }
      await supabase.from('categorias').insert([{ ...newCategoryData, imagen_url: finalUrl }]);
      toast.success("Categoría agregada");
      setNewCategoryData({ nombre: '' });
      setNewCategoryFile(null);
      cargarDatos();
    } catch (error) { toast.error("Error: " + error.message); }
    finally { toast.dismiss(loadingToast); }
  }
  const handleCancelAddCategory = () => { setNewCategoryData({ nombre: '' }); setNewCategoryFile(null); toast('Formulario limpiado.', { icon: '👋' }); };
  const handleOpenEditCategory = (category) => { setCategoryToEdit(category); setIsCategoryModalOpen(true); }
  const handleSaveCategory = async (formData) => {
    const { error } = await supabase.from('categorias').update(formData).eq('id', categoryToEdit.id);
    if (error) { toast.error("Error: " + error.message); throw new Error(error.message); }
    toast.success("Categoría actualizada");
    cargarDatos();
  }
  const handleDeleteCategory = (id) => { setConfirmModalState({ isOpen: true, title: 'Eliminar Categoría', message: 'Cuidado: Los productos asociados quedarán sin categoría.', onConfirm: async () => { await supabase.from('categorias').delete().eq('id', id); toast.success("Categoría eliminada"); cargarDatos(); } }); }
  
  const [newRedSocial, setNewRedSocial] = useState({ nombre: '', url: '' });
  
  // Lista predefinida de redes sociales
  const PREDEFINED_NETWORKS = ['TikTok', 'Facebook', 'Gmail', 'WhatsApp', 'Instagram'];

  // Filtrar las redes que ya han sido agregadas
  const existingNetworkNames = redesSociales.map(rs => rs.nombre);
  const availableNetworks = PREDEFINED_NETWORKS.filter(n => !existingNetworkNames.includes(n));

  useEffect(() => {
    // Si las redes disponibles cambian, actualizamos el estado del formulario para que el select tenga un valor por defecto
    if (availableNetworks.length > 0) {
      setNewRedSocial(prev => ({ ...prev, nombre: availableNetworks[0] }));
    } else {
      setNewRedSocial(prev => ({ ...prev, nombre: '' }));
    }
  }, [redesSociales]); // Se ejecuta cada vez que las redes sociales cargadas cambian


  const handleRedSocialChange = (id, field, value) => {
    setRedesSociales(redesSociales.map(rs => rs.id === id ? { ...rs, [field]: value } : rs));
  };

  const handleAddRedSocial = async (e) => {
    e.preventDefault();
    if (!newRedSocial.nombre.trim() || !newRedSocial.url.trim()) return toast.error('Debes seleccionar una red y completar la URL.');
    
    const loadingToast = toast.loading('Agregando red social...');
    try {
      const { error } = await supabase.from('redes_sociales').insert([newRedSocial]);
      if (error) throw error;
      
      toast.success('Red social agregada.');
      setNewRedSocial({ nombre: availableNetworks.length > 1 ? availableNetworks[1] : '', url: '' }); // Reset form
      cargarDatos(); // Recargar todos los datos para reflejar el cambio
    } catch (error) {
      if (error.code === '23505') { 
        toast.error('Ya existe una red social con ese nombre.');
      } else {
        toast.error('Error: ' + error.message);
      }
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleDeleteRedSocial = (id) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Eliminar Red Social',
      message: '¿Estás seguro de que quieres eliminar esta red social?',
      onConfirm: async () => {
        await supabase.from('redes_sociales').delete().eq('id', id);
        toast.success("Red social eliminada");
        cargarDatos();
      }
    });
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Actualizando...');

    const { error: negocioError } = await supabase.from('negocio').update(datosNegocio).eq('id', datosNegocio.id);

    const updatePromises = redesSociales.map(rs =>
      supabase.from('redes_sociales').update({ url: rs.url }).eq('id', rs.id)
    );
    const results = await Promise.all(updatePromises);
    const redesError = results.some(res => res.error);

    toast.dismiss(loadingToast);
    if (negocioError || redesError) {
      toast.error("Error al guardar. Intenta de nuevo.");
    } else {
      toast.success("¡Configuración guardada!");
    }
    cargarDatos();
  }

  const productosVisibles = productos.filter(p => p.activo).length;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r-2 border-gray-100 transform transition-transform md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between px-6">
          <div className="flex items-center gap-3"><Store className="text-pink-600" size={28} /><span className="font-bold text-gray-800 text-xl">Florería Admin</span></div>
          <button onClick={() => setSidebarOpen(false)} className="p-2 md:hidden text-gray-500 hover:bg-gray-100 rounded-full"><X size={20} /></button>
        </div>
        <nav className="p-4 space-y-2">
          <TabButton isActive={activeTab === 'productos'} onClick={() => handleTabClick('productos')} icon={<Package size={20} />} label="Productos" />
          <TabButton isActive={activeTab === 'categorias'} onClick={() => handleTabClick('categorias')} icon={<Tags size={20} />} label="Categorías" />
          <TabButton isActive={activeTab === 'config'} onClick={() => handleTabClick('config')} icon={<Settings size={20} />} label="Configuración" />
        </nav>
        <div className="absolute bottom-4 left-0 w-full px-4"><button onClick={async () => { await supabase.auth.signOut(); navigate('/login') }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition font-medium"><LogOut size={20} />Cerrar Sesión</button></div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-lg border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-gray-600 bg-white p-2 rounded-lg shadow-sm border border-gray-100"><Menu size={24} /></button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 capitalize ml-4 md:ml-0 flex-1">
            {activeTab === 'config' ? 'Configuración' : activeTab === 'productos' ? 'Inventario' : 'Categorías'}
          </h1>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50">
          {activeTab === 'productos' && (
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Productos" value={productos.length} icon={<Package size={24} className="text-pink-600" />} color="bg-pink-100" />
                <StatCard title="Total Categorías" value={categorias.length} icon={<Tags size={24} className="text-blue-600" />} color="bg-blue-100" />
                <StatCard title="Productos Visibles" value={`${productosVisibles} / ${productos.length}`} icon={<Eye size={24} className="text-green-600" />} color="bg-green-100" />
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-700">Inventario de Productos</h2>
                <button onClick={handleOpenCreateProduct} className="w-full md:w-auto bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold transition shadow-lg shadow-pink-200 hover:shadow-xl transform hover:-translate-y-0.5">
                  <Plus size={18} />Nuevo Producto
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left simple-table">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 md:p-5 text-sm font-semibold text-gray-600 whitespace-nowrap">Producto</th>
                        <th className="p-4 md:p-5 text-sm font-semibold text-gray-600 whitespace-nowrap">Categoría</th>
                        <th className="p-4 md:p-5 text-sm font-semibold text-gray-600 whitespace-nowrap">Precio</th>
                        <th className="p-4 md:p-5 text-center text-sm font-semibold text-gray-600 whitespace-nowrap">Estado</th>
                        <th className="p-4 md:p-5 min-w-[100px]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {productos.map(prod => (
                        <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 md:p-5">
                            <div className="flex items-center gap-3 md:gap-4 min-w-[200px]">
                              <img src={prod.imagen_url || 'https://via.placeholder.com/100'} alt={prod.nombre} className="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover flex-shrink-0 bg-gray-100" />
                              <div>
                                <div className="font-bold text-gray-800 text-sm md:text-base">{prod.nombre}</div>
                                <div className="text-xs md:text-sm text-gray-500 line-clamp-1">{(prod.descripcion || '').substring(0, 40) + (prod.descripcion?.length > 40 ? '...' : '')}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 md:p-5 whitespace-nowrap"><span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">{prod.categorias?.nombre || 'N/A'}</span></td>
                          <td className="p-4 md:p-5 font-bold text-gray-800 whitespace-nowrap">S/. {prod.precio.toFixed(2)}</td>
                          <td className="p-4 md:p-5 text-center whitespace-nowrap"><button onClick={() => handleToggleStatus(prod.id, prod.activo)} className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 mx-auto ${prod.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{prod.activo ? <Eye size={14} /> : <EyeOff size={14} />}{prod.activo ? 'Visible' : 'Oculto'}</button></td>
                          <td className="p-4 md:p-5 text-right whitespace-nowrap">
                            <div className="flex justify-end gap-1">
                              <button onClick={() => handleOpenEditProduct(prod)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"><Edit size={18} /></button>
                              <button onClick={() => handleDeleteProduct(prod.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'categorias' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Agregar Nueva Categoría</h3>
                <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="md:col-span-3"><label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label><input type="text" placeholder="Ej: Ramos" className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500" value={newCategoryData.nombre} onChange={e => setNewCategoryData({ ...newCategoryData, nombre: e.target.value })} required /></div>
                  <div className="md:col-span-3"><label className="block text-sm font-medium text-gray-700 mb-2">Imagen (Opcional)</label><ImageUploadInput file={newCategoryFile} onFileChange={setNewCategoryFile} /></div>
                  <div className="md:col-span-3 flex justify-end gap-3 mt-4"><button type="button" onClick={handleCancelAddCategory} className="flex-1 py-3 px-5 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition">Cancelar</button><button type="submit" className="flex-1 bg-pink-600 text-white py-3 px-5 rounded-lg font-bold hover:bg-pink-700 transition flex items-center justify-center gap-2"><Plus size={18} />Agregar Categoría</button></div>
                </form>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left simple-table">
                    <thead className="bg-gray-50"><tr><th className="p-4 md:p-5 text-sm font-semibold text-gray-600 whitespace-nowrap">Nombre</th><th className="p-4 md:p-5 text-sm font-semibold text-gray-600 hidden md:table-cell whitespace-nowrap">Imagen</th><th className="p-4 md:p-5 min-w-[100px]"></th></tr></thead>
                    <tbody className="divide-y divide-gray-100">{categorias.map(cat => (<tr key={cat.id} className="hover:bg-gray-50 transition-colors"><td className="p-4 md:p-5 font-bold text-gray-800">{cat.nombre}</td><td className="p-4 md:p-5 text-gray-500 text-sm hidden md:table-cell"><img src={cat.imagen_url || 'https://via.placeholder.com/100'} alt={cat.nombre} className="w-16 h-10 rounded-lg object-cover bg-gray-100" /></td><td className="px-4 py-4 md:px-6 text-right whitespace-nowrap flex justify-end gap-1"><button onClick={() => handleOpenEditCategory(cat)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"><Edit size={18} /></button><button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"><Trash2 size={18} /></button></td></tr>))}</tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'config' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 py-8">
              <div className="lg:col-span-2">
                <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-pink-600">
                  <h2 className="text-2xl font-bold text-gray-800">Configuración de la Tienda</h2>
                  <p className="mt-2 text-gray-500">
                    Aquí puedes modificar los detalles principales de tu negocio y gestionar los enlaces a tus redes sociales.
                  </p>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0">
                        <Store size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-700">Datos Generales</h4>
                        <p className="text-sm text-gray-500">Nombre, ubicación y datos de contacto.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
                        <Link size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-700">Redes Sociales</h4>
                        <p className="text-sm text-gray-500">Enlaces que aparecerán en tu página.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <form onSubmit={handleSaveConfig} className="space-y-8">
                  {/* Datos del Negocio */}
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold mb-6 text-gray-800">Datos del Negocio</h3>
                    <div className="space-y-6">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Store size={18} /></span>
                        <input id="nombre_tienda" type="text" placeholder="Nombre de tu tienda" className="w-full pl-10 border-gray-300 border rounded-lg py-2.5 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200" value={datosNegocio.nombre_tienda || ''} onChange={e => setDatosNegocio({ ...datosNegocio, nombre_tienda: e.target.value })} />
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Package size={18} /></span>
                        <input id="ubicacion" type="text" placeholder="Ciudad, Región" className="w-full pl-10 border-gray-300 border rounded-lg py-2.5 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200" value={datosNegocio.ubicacion || ''} onChange={e => setDatosNegocio({ ...datosNegocio, ubicacion: e.target.value })} />
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Phone size={18} /></span>
                        <input id="celular_whatsapp" type="text" placeholder="WhatsApp con código de país" className="w-full pl-10 border-gray-300 border rounded-lg py-2.5 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200" value={datosNegocio.celular_whatsapp || ''} onChange={e => setDatosNegocio({ ...datosNegocio, celular_whatsapp: e.target.value })} />
                      </div>
                      <div>
                        <textarea id="mensaje_pedidos" rows="3" placeholder="Mensaje predeterminado para WhatsApp" className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200" value={datosNegocio.mensaje_pedidos || ''} onChange={e => setDatosNegocio({ ...datosNegocio, mensaje_pedidos: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  {/* Redes Sociales */}
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold mb-6 text-gray-800">Redes Sociales</h3>
                    <div className="space-y-3 mb-6">
                      {redesSociales.length > 0 ? (
                        redesSociales.map((rs) => (
                          <div key={rs.id} className="flex items-center gap-3">
                            <span className="w-36 p-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold text-center">{rs.nombre}</span>
                            <input type="text" placeholder="https://..." value={rs.url} onChange={(e) => handleRedSocialChange(rs.id, 'url', e.target.value)} className="flex-1 p-2 border-gray-300 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm transition duration-200" />
                            <button type="button" onClick={() => handleDeleteRedSocial(rs.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition duration-200"><Trash2 size={18} /></button>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4 italic">No has agregado ninguna red social.</p>
                      )}
                    </div>
                    {availableNetworks.length > 0 && (
                      <div className="pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                          <select value={newRedSocial.nombre} onChange={e => setNewRedSocial({ ...newRedSocial, nombre: e.target.value })} className="w-36 p-2.5 border-gray-300 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white text-gray-700 transition duration-200 text-sm">
                            {availableNetworks.map(net => <option key={net} value={net}>{net}</option>)}
                          </select>
                          <input type="text" placeholder="URL Completa" value={newRedSocial.url} onChange={e => setNewRedSocial({ ...newRedSocial, url: e.target.value })} className="flex-1 p-2.5 border-gray-300 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200 text-sm" />
                          <button type="button" onClick={handleAddRedSocial} className="px-4 py-2.5 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition duration-200 flex-shrink-0 text-sm">Agregar</button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" className="px-8 py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-300 transition duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                      <Save size={20} /> Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title={productToEdit ? "Editar Producto" : "Nuevo Producto"}><ProductForm productToEdit={productToEdit} categories={categorias} onSave={handleSaveProduct} onClose={() => setIsProductModalOpen(false)} /></Modal>
      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title="Editar Categoría"><CategoryForm categoryToEdit={categoryToEdit} onSave={handleSaveCategory} onClose={() => setIsCategoryModalOpen(false)} /></Modal>
      <ConfirmationModal isOpen={confirmModalState.isOpen} onClose={() => setConfirmModalState({ ...confirmModalState, isOpen: false })} onConfirm={confirmModalState.onConfirm} title={confirmModalState.title} message={confirmModalState.message} />
    </div>
  )
}

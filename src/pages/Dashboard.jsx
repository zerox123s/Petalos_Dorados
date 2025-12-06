import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import { uploadImage } from '../uploadImage';
import { 
  Package, Tags, Settings, LogOut, Menu, Edit, Trash2, Plus, Store, 
  Eye, EyeOff, Save, Image, DollarSign, FileCheck2, Instagram, Facebook, X
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
      {file ? ( <><FileCheck2 className="mx-auto text-green-500" /><span className="text-xs mt-1 text-green-600 font-bold">{file.name}</span></> ) : ( <><Image className="mx-auto" /><span className="text-xs mt-1">Subir foto</span></> )}
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
  const [confirmModalState, setConfirmModalState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [datosNegocio, setDatosNegocio] = useState({})
  
  const [newCategoryData, setNewCategoryData] = useState({ nombre: ''})
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
    if (prods) setProductos(prods)
    if (cats) setCategorias(cats)
    if (neg) setDatosNegocio(neg)
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
  const handleUpdateNegocio = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Actualizando...');
    const { error } = await supabase.from('negocio').update(datosNegocio).eq('id', datosNegocio.id);
    toast.dismiss(loadingToast);
    if (error) toast.error("Error: " + error.message);
    else toast.success("¡Configuración guardada!");
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
        <header className="h-20 bg-white/80 backdrop-blur-lg border-b flex items-center justify-between px-8">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-gray-600"><Menu /></button>
          <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h1>
          <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">J</div>
        </header>

        <main className="flex-1 overflow-auto p-8 bg-gray-50">
          {activeTab === 'productos' && (
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Productos" value={productos.length} icon={<Package size={24} className="text-pink-600" />} color="bg-pink-100" />
                <StatCard title="Total Categorías" value={categorias.length} icon={<Tags size={24} className="text-blue-600" />} color="bg-blue-100" />
                <StatCard title="Productos Visibles" value={`${productosVisibles} / ${productos.length}`} icon={<Eye size={24} className="text-green-600" />} color="bg-green-100" />
              </div>
              <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-700">Inventario de Productos</h2><button onClick={handleOpenCreateProduct} className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition shadow-lg shadow-pink-200 hover:shadow-xl transform hover:-translate-y-0.5"><Plus size={18} />Nuevo Producto</button></div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left"><thead className="bg-gray-50"><tr><th className="p-5 text-sm font-semibold text-gray-600">Producto</th><th className="p-5 text-sm font-semibold text-gray-600">Categoría</th><th className="p-5 text-sm font-semibold text-gray-600">Precio</th><th className="p-5 text-center text-sm font-semibold text-gray-600">Estado</th><th className="p-5"></th></tr></thead><tbody className="divide-y divide-gray-100">{productos.map(prod => (<tr key={prod.id} className="hover:bg-gray-50 transition-colors"><td className="p-5"><div className="flex items-center gap-4"><img src={prod.imagen_url || 'https://via.placeholder.com/100'} alt={prod.nombre} className="w-16 h-16 rounded-xl object-cover" /><div><div className="font-bold text-gray-800">{prod.nombre}</div><div className="text-sm text-gray-500">{(prod.descripcion || '').substring(0, 40) + '...'}</div></div></div></td><td className="p-5"><span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">{prod.categorias?.nombre || 'N/A'}</span></td><td className="p-5 font-bold text-gray-800">S/. {prod.precio.toFixed(2)}</td><td className="p-5 text-center"><button onClick={() => handleToggleStatus(prod.id, prod.activo)} className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 mx-auto ${prod.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{prod.activo ? <Eye size={14}/> : <EyeOff size={14}/>}{prod.activo ? 'Visible' : 'Oculto'}</button></td><td className="p-5 text-right"><button onClick={() => handleOpenEditProduct(prod)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"><Edit size={18} /></button><button onClick={() => handleDeleteProduct(prod.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"><Trash2 size={18} /></button></td></tr>))}</tbody></table>
              </div>
            </div>
          )}
          {activeTab === 'categorias' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Agregar Nueva Categoría</h3>
                <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="md:col-span-3"><label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label><input type="text" placeholder="Ej: Ramos" className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500" value={newCategoryData.nombre} onChange={e => setNewCategoryData({...newCategoryData, nombre: e.target.value})} required/></div>
                  <div className="md:col-span-3"><label className="block text-sm font-medium text-gray-700 mb-2">Imagen (Opcional)</label><ImageUploadInput file={newCategoryFile} onFileChange={setNewCategoryFile} /></div>
                  <div className="md:col-span-3 flex justify-end gap-3 mt-4"><button type="button" onClick={handleCancelAddCategory} className="flex-1 py-3 px-5 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition">Cancelar</button><button type="submit" className="flex-1 bg-pink-600 text-white py-3 px-5 rounded-lg font-bold hover:bg-pink-700 transition flex items-center justify-center gap-2"><Plus size={18} />Agregar Categoría</button></div>
                </form>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50"><tr><th className="p-5 text-sm font-semibold text-gray-600">Nombre</th><th className="p-5 text-sm font-semibold text-gray-600 hidden md:table-cell">Imagen</th><th className="p-5"></th></tr></thead>
                  <tbody className="divide-y divide-gray-100">{categorias.map(cat => (<tr key={cat.id} className="hover:bg-gray-50 transition-colors"><td className="p-5 font-bold text-gray-800">{cat.nombre}</td><td className="p-5 text-gray-500 text-sm hidden md:table-cell"><img src={cat.imagen_url || 'https://via.placeholder.com/100'} alt={cat.nombre} className="w-16 h-10 rounded-lg object-cover" /></td><td className="px-6 py-4 text-right"><button onClick={() => handleOpenEditCategory(cat)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"><Edit size={18} /></button><button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"><Trash2 size={18} /></button></td></tr>))}</tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'config' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Datos del Negocio y Redes</h3>
                <form onSubmit={handleUpdateNegocio} className="space-y-6">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Tienda</label><input className="w-full p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-pink-500" value={datosNegocio.nombre_tienda || ''} onChange={e => setDatosNegocio({...datosNegocio, nombre_tienda: e.target.value})} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp (con código de país)</label><input className="w-full p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-pink-500" value={datosNegocio.celular_whatsapp || ''} onChange={e => setDatosNegocio({...datosNegocio, celular_whatsapp: e.target.value})} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Enlace de Facebook</label><input className="w-full p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-pink-500" placeholder="https://facebook.com/tu-pagina" value={datosNegocio.enlace_facebook || ''} onChange={e => setDatosNegocio({...datosNegocio, enlace_facebook: e.target.value})} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Enlace de Instagram</label><input className="w-full p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-pink-500" placeholder="https://instagram.com/tu-usuario" value={datosNegocio.enlace_instagram || ''} onChange={e => setDatosNegocio({...datosNegocio, enlace_instagram: e.target.value})} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Mensaje de Pedido Predeterminado</label><textarea rows="3" className="w-full p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-pink-500" value={datosNegocio.mensaje_pedidos || ''} onChange={e => setDatosNegocio({...datosNegocio, mensaje_pedidos: e.target.value})} /></div>
                  <button type="submit" className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-black transition flex items-center justify-center gap-2"><Save size={18}/> Guardar Configuración</button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title={productToEdit ? "Editar Producto" : "Nuevo Producto"}><ProductForm productToEdit={productToEdit} categories={categorias} onSave={handleSaveProduct} onClose={() => setIsProductModalOpen(false)} /></Modal>
      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title="Editar Categoría"><CategoryForm categoryToEdit={categoryToEdit} onSave={handleSaveCategory} onClose={() => setIsCategoryModalOpen(false)} /></Modal>
      <ConfirmationModal isOpen={confirmModalState.isOpen} onClose={() => setConfirmModalState({ ...confirmModalState, isOpen: false })} onConfirm={confirmModalState.onConfirm} title={confirmModalState.title} message={confirmModalState.message}/>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import { 
  Package, Tags, Settings, LogOut, Menu, Edit, Trash2, Plus, Store, 
  Eye, EyeOff, Save 
} from 'lucide-react'
import toast from 'react-hot-toast'

import Modal from '../components/Modal'
import ProductForm from '../components/ProductForm'

export default function Dashboard() {
  const navigate = useNavigate()
  
  // Estados UI
  const [activeTab, setActiveTab] = useState('productos')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState(null)

  // Datos
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [datosNegocio, setDatosNegocio] = useState({})
  
  const [nuevaCategoria, setNuevaCategoria] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return navigate('/login')
      cargarDatos()
    }
    init()
  }, [])

  const cargarDatos = async () => {
    // CARGAMOS TODOS (ACTIVOS E INACTIVOS)
    const { data: prods } = await supabase
      .from('productos')
      .select('*, categorias(nombre)')
      .order('created_at', { ascending: false })
    
    const { data: cats } = await supabase.from('categorias').select('*').order('created_at', { ascending: true })
    const { data: neg } = await supabase.from('negocio').select('*').single()

    if (prods) setProductos(prods)
    if (cats) setCategorias(cats)
    if (neg) setDatosNegocio(neg)
  }

  // --- LÓGICA PRODUCTOS ---
  
  const handleOpenCreate = () => {
    setProductToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (producto) => {
    setProductToEdit(producto)
    setIsModalOpen(true)
  }

  const handleSaveProduct = async (formData) => {
    let error = null
    const loadingToast = toast.loading('Guardando...')

    if (productToEdit) {
      const { error: err } = await supabase.from('productos').update(formData).eq('id', productToEdit.id)
      error = err
    } else {
      const { error: err } = await supabase.from('productos').insert([{ ...formData, activo: true }])
      error = err
    }

    toast.dismiss(loadingToast)

    if (error) {
      toast.error("Error: " + error.message)
    } else {
      toast.success(productToEdit ? "Producto actualizado" : "Producto creado")
      cargarDatos()
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm("¿Eliminar definitivamente?")) return
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) toast.error("Error al eliminar")
    else {
      toast.success("Producto eliminado")
      cargarDatos()
    }
  }

  // NUEVO: CAMBIAR ESTADO (VISIBLE / NO VISIBLE)
  const handleToggleStatus = async (id, currentStatus) => {
    const { error } = await supabase
      .from('productos')
      .update({ activo: !currentStatus })
      .eq('id', id)
    
    if (error) toast.error("No se pudo cambiar el estado")
    else {
      toast.success(currentStatus ? "Producto desactivado (Sin Stock)" : "Producto activado")
      cargarDatos()
    }
  }

  // --- LÓGICA CATEGORÍAS ---
  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!nuevaCategoria.trim()) return
    const { error } = await supabase.from('categorias').insert([{ nombre: nuevaCategoria }])
    if (!error) {
      toast.success("Categoría agregada")
      setNuevaCategoria('')
      cargarDatos()
    }
  }

  const handleDeleteCategory = async (id) => {
    if(!confirm("Cuidado: Los productos de esta categoría quedarán huérfanos.")) return
    await supabase.from('categorias').delete().eq('id', id)
    cargarDatos()
  }

  // --- LÓGICA NEGOCIO ---
  const handleUpdateNegocio = async (e) => {
    e.preventDefault()
    const loadingToast = toast.loading('Actualizando configuración...')
    
    const { error } = await supabase.from('negocio').update(datosNegocio).eq('id', datosNegocio.id)
    
    toast.dismiss(loadingToast)
    
    if (error) toast.error("Error: " + error.message)
    else toast.success("¡Configuración guardada correctamente!")
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b">
          <Store className="text-pink-600 mr-2" />
          <span className="font-bold text-gray-800 text-lg">Admin Panel</span>
        </div>
        <nav className="p-4 space-y-1">
          <button onClick={() => setActiveTab('productos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'productos' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Package size={20} /> Productos
          </button>
          <button onClick={() => setActiveTab('categorias')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'categorias' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Tags size={20} /> Categorías
          </button>
          <button onClick={() => setActiveTab('config')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'config' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Settings size={20} /> Configuración
          </button>
        </nav>
        <div className="absolute bottom-4 left-0 w-full px-4">
          <button onClick={async () => { await supabase.auth.signOut(); navigate('/login') }} className="flex items-center gap-2 text-red-500 hover:bg-red-50 p-3 rounded-lg w-full transition font-medium">
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-gray-500">
            <Menu />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h1>
        </header>

        <main className="flex-1 overflow-auto p-6">
          
          {/* VISTA PRODUCTOS */}
          {activeTab === 'productos' && (
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-500">Gestiona tu inventario completo.</p>
                <button 
                  onClick={handleOpenCreate}
                  className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus size={18} /> Nuevo Producto
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {productos.map(prod => (
                      <tr key={prod.id} className={`hover:bg-gray-50 transition duration-150 ${!prod.activo ? 'bg-gray-50 opacity-75' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img src={prod.imagen_url || 'https://via.placeholder.com/100'} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm" />
                            <div>
                              <div className="font-medium text-gray-900">{prod.nombre}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[200px]">{prod.descripcion || 'Sin descripción'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {prod.categorias?.nombre || 'General'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-700">S/. {prod.precio.toFixed(2)}</td>
                        
                        {/* COLUMNA ESTADO (TOGGLE) */}
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleToggleStatus(prod.id, prod.activo)}
                            className={`flex items-center gap-1 mx-auto px-3 py-1 rounded-full text-xs font-bold transition ${
                              prod.activo 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                            }`}
                          >
                            {prod.activo ? <><Eye size={14}/> Activo</> : <><EyeOff size={14}/> Oculto</>}
                          </button>
                        </td>

                        <td className="px-6 py-4 text-right space-x-2">
                          <button 
                            onClick={() => handleOpenEdit(prod)}
                            className="text-gray-400 hover:text-blue-600 transition p-1 hover:bg-blue-50 rounded" title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="text-gray-400 hover:text-red-600 transition p-1 hover:bg-red-50 rounded" title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {productos.length === 0 && <div className="p-10 text-center text-gray-400">No hay productos registrados</div>}
              </div>
            </div>
          )}

          {/* VISTA CATEGORÍAS (Sin cambios mayores, solo mantener estructura) */}
          {activeTab === 'categorias' && (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-6 text-gray-800">Administrar Categorías</h3>
              <form onSubmit={handleAddCategory} className="flex gap-3 mb-8">
                <input 
                  type="text" 
                  placeholder="Nombre de nueva categoría..." 
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
                  value={nuevaCategoria}
                  onChange={e => setNuevaCategoria(e.target.value)}
                />
                <button className="bg-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-pink-700 transition">Agregar</button>
              </form>
              <div className="space-y-3">
                {categorias.map(cat => (
                  <div key={cat.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100 group hover:border-pink-200 transition">
                    <span className="font-medium text-gray-700">{cat.nombre}</span>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VISTA CONFIGURACIÓN */}
          {activeTab === 'config' && (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-6 text-gray-800">Datos del Negocio</h3>
              <form onSubmit={handleUpdateNegocio} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Tienda</label>
                  <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-500 outline-none" 
                    value={datosNegocio.nombre_tienda || ''} onChange={e => setDatosNegocio({...datosNegocio, nombre_tienda: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (con código de país)</label>
                  <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-500 outline-none" 
                    value={datosNegocio.celular_whatsapp || ''} onChange={e => setDatosNegocio({...datosNegocio, celular_whatsapp: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje de Pedido</label>
                  <textarea rows="3" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-500 outline-none" 
                    value={datosNegocio.mensaje_pedidos || ''} onChange={e => setDatosNegocio({...datosNegocio, mensaje_pedidos: e.target.value})} />
                </div>
                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-black transition flex items-center justify-center gap-2">
                  <Save size={18}/> Guardar Cambios
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={productToEdit ? "Editar Producto" : "Nuevo Producto"}
      >
        <ProductForm 
          productToEdit={productToEdit} 
          categories={categorias} 
          onSave={handleSaveProduct}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

    </div>
  )
}
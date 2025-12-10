import { Store, Link, Save, Trash2, Package, Phone, MessageSquare } from 'lucide-react';
import SocialIcon from '../components/SocialIcon';

const InputField = ({ label, id, icon, placeholder, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">{icon}</span>
            <input
                id={id}
                type="text"
                placeholder={placeholder}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                value={value || ''}
                onChange={onChange}
            />
        </div>
    </div>
);

const TextareaField = ({ label, id, placeholder, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
        <textarea
            id={id}
            rows="3"
            placeholder={placeholder}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
            value={value || ''}
            onChange={onChange}
        />
    </div>
);

const SectionCard = ({ title, children }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold mb-6 text-gray-800">{title}</h3>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);


const Configuracion = ({
    datosNegocio,
    setDatosNegocio,
    redesSociales,
    handleSaveConfig,
    availableNetworks,
    newRedSocial,
    setNewRedSocial,
    handleAddRedSocial,
    handleDeleteRedSocial,
    handleRedSocialChange
}) => {

    return (
        <div className="max-w-5xl mx-auto py-8">
            <form onSubmit={handleSaveConfig} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SectionCard title="Datos del Negocio">
                        <InputField
                            label="Nombre de la Tienda"
                            id="nombre_tienda"
                            icon={<Store size={20} />}
                            placeholder="Ej: Florería El Jardín"
                            value={datosNegocio.nombre_tienda}
                            onChange={e => setDatosNegocio({ ...datosNegocio, nombre_tienda: e.target.value })}
                        />
                        <InputField
                            label="Ubicación"
                            id="ubicacion"
                            icon={<Package size={20} />}
                            placeholder="Ej: Lima, Perú"
                            value={datosNegocio.ubicacion}
                            onChange={e => setDatosNegocio({ ...datosNegocio, ubicacion: e.target.value })}
                        />
                        <InputField
                            label="WhatsApp de Contacto"
                            id="celular_whatsapp"
                            icon={<Phone size={20} />}
                            placeholder="+51 987 654 321"
                            value={datosNegocio.celular_whatsapp}
                            onChange={e => setDatosNegocio({ ...datosNegocio, celular_whatsapp: e.target.value })}
                        />
                        <TextareaField
                            label="Mensaje Predeterminado de Pedidos"
                            id="mensaje_pedidos"
                            placeholder="Hola, me gustaría hacer un pedido..."
                            value={datosNegocio.mensaje_pedidos}
                            onChange={e => setDatosNegocio({ ...datosNegocio, mensaje_pedidos: e.target.value })}
                        />
                    </SectionCard>

                    <SectionCard title="Redes Sociales">
                        <div className="space-y-4">
                            {redesSociales.length > 0 ? (
                                redesSociales.map((rs) => (
                                    <div key={rs.id} className="flex items-center gap-3">
                                        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <SocialIcon name={rs.nombre} size={24} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="URL del perfil"
                                            value={rs.url}
                                            onChange={(e) => handleRedSocialChange(rs.id, 'url', e.target.value)}
                                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 transition min-w-0"
                                        />
                                        <button type="button" onClick={() => handleDeleteRedSocial(rs.id)} className="p-3 text-red-500 hover:bg-red-100 rounded-full transition"><Trash2 size={20} /></button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">Aún no has agregado ninguna red social.</p>
                            )}
                        </div>

                        {availableNetworks.length > 0 && (
                            <div className="pt-6 border-t border-gray-200">
                                <h4 className="text-md font-bold text-gray-700 mb-3">Añadir Nueva Red</h4>
                                <div className="grid md:grid-cols-3 gap-3 items-center">
                                    <select
                                        value={newRedSocial.nombre}
                                        onChange={e => setNewRedSocial({ ...newRedSocial, nombre: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                                    >
                                        {availableNetworks.map(net => <option key={net} value={net}>{net}</option>)}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="URL Completa"
                                        value={newRedSocial.url}
                                        onChange={e => setNewRedSocial({ ...newRedSocial, url: e.target.value })}
                                        className="w-full md:col-span-2 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                                    />
                                    <button type="button" onClick={handleAddRedSocial} className="md:col-span-3 px-4 py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition">
                                        Agregar
                                    </button>
                                </div>
                            </div>
                        )}
                    </SectionCard>
                </div>

                <div className="flex justify-end mt-8">
                    <button type="submit" className="px-8 py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-300 transition shadow-lg hover:shadow-xl flex items-center gap-2">
                        <Save size={20} />
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Configuracion;

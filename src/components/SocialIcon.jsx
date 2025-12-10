import { Facebook, Instagram, Mail, Phone, Link as LinkIcon } from 'lucide-react';

const SocialIcon = ({ name, size = 20 }) => {
  const normalizedName = name.toLowerCase();
  
  if (normalizedName.includes('facebook')) return <Facebook size={size} />;
  if (normalizedName.includes('instagram')) return <Instagram size={size} />;
  if (normalizedName.includes('tiktok')) return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music-4"><path d="M9 18V5l12-2v13"/><path d="m9 18-5.523-2.906A1 1 0 0 1 3 14.236V9.52a1 1 0 0 1 .477-.859L9 5"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
  if (normalizedName.includes('gmail')) return <Mail size={size} />;
  if (normalizedName.includes('whatsapp')) return <Phone size={size} />;

  return <LinkIcon size={size} />; // Icono por defecto
};

export default SocialIcon;

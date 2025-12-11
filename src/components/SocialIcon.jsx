import { Facebook, Instagram, Mail, Phone, Link as LinkIcon } from 'lucide-react';

const SocialIcon = ({ name, size = 20 }) => {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes('facebook')) return <Facebook size={size} />;
  if (normalizedName.includes('instagram')) return <Instagram size={size} />;
  if (normalizedName.includes('tiktok')) return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v4a9 9 0 0 1-9-9v12Z" /></svg>;
  if (normalizedName.includes('gmail')) return <Mail size={size} />;
  if (normalizedName.includes('whatsapp')) return <Phone size={size} />;

  return <LinkIcon size={size} />; // Icono por defecto
};

export default SocialIcon;

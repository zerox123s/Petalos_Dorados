export const uploadImage = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error("Faltan las variables de entorno de Cloudinary");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!response.ok) throw new Error("Error subiendo imagen");

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error en Cloudinary:", error);
    return null;
  }
};
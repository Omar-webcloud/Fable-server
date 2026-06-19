export async function uploadToImgBB(buffer, filename) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("IMGBB_API_KEY is not configured");
  }

  const formData = new FormData();
  const blob = new Blob([buffer]);
  formData.append("image", blob, filename);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    { method: "POST", body: formData }
  );

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error?.message || "Image upload failed");
  }

  return {
    url: data.data.url,
    deleteUrl: data.data.delete_url,
    displayUrl: data.data.display_url,
  };
}

// src/utils/imageUtils.js

export const getImageUrl = (fileUrl) => {
  if (!fileUrl) return null;
  const encodedUrl = encodeURIComponent(fileUrl);
  return `http://www.product.somee.com/api/Product/GetFile?url=${encodedUrl}`;
};

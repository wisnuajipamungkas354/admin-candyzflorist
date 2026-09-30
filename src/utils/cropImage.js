/**
 * Helper canvas untuk menghasilkan gambar hasil crop dan rotasi
 */

export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Memotong gambar berdasarkan area crop pixel dan rotasi
 * @param {string} imageSrc - URL atau base64 gambar
 * @param {Object} pixelCrop - { x, y, width, height }
 * @param {number} rotation - Sudut rotasi (derajat)
 * @returns {Promise<{ file: File, url: string }>}
 */
export default async function getCroppedImg(
  imageSrc,
  pixelCrop,
  rotation = 0,
  fileName = 'cropped-product.jpg'
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context tidak tersedia');
  }

  const rotRad = getRadianAngle(rotation);

  // Hitung ukuran bounding box setelah dirotasi
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // Set ukuran canvas sebesar bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Pindahkan titik pusat ke tengah canvas lalu rotasi
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Gambar image asli
  ctx.drawImage(image, 0, 0);

  // Buat canvas kedua untuk area crop sebenarnya
  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  if (!croppedCtx) {
    throw new Error('Canvas 2D context tidak tersedia untuk crop');
  }

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Salin area crop dari canvas pertama ke canvas crop
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Konversi ke Blob dan File
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas kosong / gagal membuat blob'));
          return;
        }
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        resolve({ file, url, blob });
      },
      'image/jpeg',
      0.92
    );
  });
}

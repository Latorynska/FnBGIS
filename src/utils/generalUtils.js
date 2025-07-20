// utils/resizeImage.js
export const resizeImage = (file, maxWidth = 500) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = maxWidth / img.width;
            const width = maxWidth;
            const height = img.height * scale;

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error("Failed to resize image."));
            }, file.type);
        };

        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
};
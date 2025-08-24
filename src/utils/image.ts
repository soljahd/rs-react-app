export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const validateImage = (file: File): string | null => {
  const allowed = ['image/png', 'image/jpeg'];
  if (!allowed.includes(file.type)) return 'Only PNG or JPEG allowed';
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) return 'Max file size is 2MB';
  return null;
};

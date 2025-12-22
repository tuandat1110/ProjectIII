export const formatDate = (dateString: string) => {
  if (!dateString) return "Chưa cập nhật";
  
  const date = new Date(dateString);

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};


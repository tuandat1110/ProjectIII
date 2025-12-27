const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return ""; 

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Chưa cập nhật";

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

export function uuidToBase62(uuid: string): string {
    // Validate UUID
    if (!/^[0-9a-fA-F-]{36}$/.test(uuid)) {
        throw new Error("Invalid UUID format");
    }

    // Bỏ dấu "-"
    const hex = uuid.replace(/-/g, "");

    // Hex -> byte array
    const bytes: number[] = [];
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.slice(i, i + 2), 16));
    }

    // Encode Base62
    let temp = [...bytes];
    let result = "";

    while (true) {
        let remainder = 0;
        let allZero = true;

        for (let i = 0; i < temp.length; i++) {
            const value = (remainder << 8) | temp[i];
            temp[i] = Math.floor(value / 62);
            remainder = value % 62;

            if (temp[i] !== 0) allZero = false;
        }

        result = BASE62[remainder] + result;
        if (allZero) break;
    }

    return result;
}

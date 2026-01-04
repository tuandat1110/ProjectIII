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

export function base62ToUuid(base62: string): string {
    const chars = base62.split("");
    const bytes = [0];

    for (const char of chars) {
        let value = BASE62.indexOf(char);
        if (value === -1) throw new Error("Invalid Base62 character");

        for (let i = 0; i < bytes.length; i++) {
            value += bytes[i] * 62;
            bytes[i] = value & 0xff;
            value >>= 8;
        }

        while (value > 0) {
            bytes.push(value & 0xff);
            value >>= 8;
        }
    }

    while (bytes.length < 16) {
        bytes.push(0);
    }

    const hex = bytes
        .reverse()
        .slice(-16) 
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

    return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20, 32)
    ].join("-");
}
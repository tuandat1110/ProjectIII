export const userKeys = {
  // Key cơ bản cho tất cả các user-related queries
  all: ['users'] as const, 

  // Key để lấy danh sách houses của một user cụ thể (dựa trên ID)
  // [ 'users', 'houses', 1 ]
  houses: (userId: string | number) => 
    [...userKeys.all, 'houses', userId] as const,
};

export const houseKeys = {
  all: ['houses'] as const,

  rooms: (houseId: string | number) => 
    [...houseKeys.all, 'houses', houseId] as const
}
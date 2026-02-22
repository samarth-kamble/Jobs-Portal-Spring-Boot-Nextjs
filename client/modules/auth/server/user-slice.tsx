import { getItem, removeItem, setItem } from '@/modules/redux/local-storage-service';
import { createSlice } from '@reduxjs/toolkit';

const UserSlice = createSlice({
  name: "user",
  initialState: null as any, // Read defensively on client hooks instead of module scope to spare SSR
  reducers: {
    setUser: (state, action) => {
      setItem("user", action.payload);
      state = action.payload;
      return state;
    },

    removeUser: (state) => {
      removeItem("user");
      state = null;
      return state;
    },
  },
});

export const { setUser, removeUser } = UserSlice.actions;
export default UserSlice.reducer;


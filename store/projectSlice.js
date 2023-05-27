import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// export const getHotSallers = createAsyncThunk(
//   "product/getProducts",
//   async (_, thunkAPI) => {
//     const { rejectedWithValue } = thunkAPI;
//     try {
//       const res = await fetch("https://fake-server-ecommerce.herokuapp.com/hot-sallers");
//       const data = await res.json();
//       return data;
//     } catch (error) {
//       return rejectedWithValue(error.message);
//     }
//   }
// );


// Level 1 -> Create The Actions [pending, fulfilled, rejected]
// level 2 ->  dispatch The Actions [pending, fulfilled, rejected]
// level 3 -> The Extra Reducers

const projectSlice = createSlice({
  name: "project",
  initialState: {
    value: 0,
    token: null,
    isAuthenticated: false,
    reload: false,
  },
  reducers: {
    increseValue: (state, action) => {
      state.value = ++state.value;
    },
    authenticate: (state, action) => {
      // state.token = action.payload;


      // AsyncStorage.setItem("token", action.payload)
        // .then((token) => state.token = token)
        // .then((a) => console.log("token ", a))
      // .then((token) => )
      // state.isAuthenticated = true
      // state.isAuthenticated = !!state.token
    },
    reloadTranslate: (state, action) => {

    }
  },
});

export const {
  increseValue,
  authenticate,
  reloadTranslate
} = projectSlice.actions;

export default projectSlice.reducer;

// const indexOfObject = searchInCart.findIndex(o =>
//   o.id === targetItem
// )
// state.itemsInCart.splice(indexOfObject, 1);


// انا محمد مطور واجهة الأمامية ويب عندي خبرة كبيرة بتمكنني من انه اعمل مواقع بجودة قوية وأداء عالي ومتجاوبة مع جميع الاحجام والي
// بتقدر تشوفها من البورتوفوليو الخاص بيا او على القيت هب

// PostgreSQL و نظام إدارة قواعد البيانات علائقي يعتمد التعامل معه على لغة إس كيو إل، يعمل على منصات متعددة من مثل أنظمة التشغي
// غو ‏ هي لغة برمجة مفتوحة المصدر من تطوير شركة جوجل. التصميم الأول للغة 
import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existing = state.items.find(i => i.id === item.id)
      if (existing) existing.qty += item.qty || 1
      else state.items.push({ ...item, qty: item.qty || 1 })
    },
    decrementItem: (state, action) => {
      const { id, qty } = typeof action.payload === 'object' ? action.payload : { id: action.payload }
      const dec = qty || 1
      const existing = state.items.find(i => i.id === id)
      if (!existing) return
      existing.qty -= dec
      if (existing.qty <= 0) state.items = state.items.filter(i => i.id !== id)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    clearCart: (state) => { state.items = [] },
  }
})

export const { addToCart, decrementItem, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer

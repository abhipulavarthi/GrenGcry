import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

// Simple 3-level mock category tree (expanded)
const DATA = [
  // Fresh
  {
    key: 'vegetables', label: 'Vegetables',
    children: [
      { key: 'fresh', label: 'Fresh Vegetables', children: ['Tomato','Potato','Onion','Carrot','Capsicum','Cauliflower','Cabbage','Cucumber','Beans'] },
    ]
  },
  {
    key: 'fruits', label: 'Fruits',
    children: [
      { key: 'fresh', label: 'Fresh Fruits', children: ['Banana','Orange','Grapes','Mango','Pineapple','Pomegranate','Papaya','Apple'] },
    ]
  },
  // Pantry
  {
    key: 'staples', label: 'Foodgrains, Oil & Masala',
    children: [
      { key: 'grains', label: 'Grains', children: ['Basmati Rice','Sona Masoori Rice','Wheat Flour (Atta)','Poha','Rava/Sooji','Oats'] },
      { key: 'pulses', label: 'Pulses & Lentils', children: ['Toor Dal','Moong Dal','Chana Dal','Masoor Dal','Urad Dal'] },
      { key: 'oils', label: 'Edible Oils', children: ['Sunflower Oil','Mustard Oil','Groundnut Oil','Olive Oil','Ghee'] },
      { key: 'spices', label: 'Spices', children: ['Turmeric Powder','Red Chilli Powder','Coriander Powder','Cumin Seeds','Garam Masala'] },
    ]
  },
  // Bakery & Dairy
  {
    key: 'bakery', label: 'Bakery, Cakes & Dairy',
    children: [
      { key: 'snacks', label: 'Bakery Snacks', children: ['Rusks', 'Khari', 'Puffs'] },
      { key: 'breads', label: 'Breads & Buns', children: ['Brown Bread', 'Whole Wheat'] },
      { key: 'cakes', label: 'Cakes & Pastries', children: ['Truffle', 'Cheesecake'] },
      { key: 'dairy', label: 'Dairy', children: ['Paneer', 'Curd', 'Butter','Cheese','Yogurt'] },
      { key: 'ice', label: 'Ice Creams & Desserts', children: ['Family Packs', 'Cones'] },
    ]
  },
  // Breakfast
  {
    key: 'breakfast', label: 'Breakfast & Instant Foods',
    children: [
      { key: 'cereals', label: 'Cereals', children: ['Corn Flakes','Muesli'] },
      { key: 'spreads', label: 'Spreads', children: ['Peanut Butter','Mixed Fruit Jam','Chocolate Spread'] },
      { key: 'rtc', label: 'Ready to Cook', children: ['Idli Batter','Dosa Batter','Pancake Mix'] },
    ]
  },
  // Snacks
  {
    key: 'snacks', label: 'Snacks & Branded Foods',
    children: [
      { key: 'chips', label: 'Chips & Namkeen', children: ['Potato Chips','Nachos','Popcorn','Mixture'] },
      { key: 'biscuits', label: 'Biscuits & Cookies', children: ['Marie Biscuits','Digestive Biscuits','Chocolate Cookies'] },
      { key: 'sauces', label: 'Spreads, Sauces, Ketchup', children: ['Ketchup', 'Mayonnaise'] },
    ]
  },
  // Beverages
  {
    key: 'beverages', label: 'Beverages',
    children: [
      { key: 'juices', label: 'Juices & Drinks', children: ['Apple Juice','Orange Juice','Mango Drink','Coconut Water'] },
      { key: 'coffee', label: 'Coffee & Tea', children: ['Instant Coffee','Ground Coffee','Green Tea','Black Tea'] },
      { key: 'energy', label: 'Energy & Soft Drinks', children: ['Energy Drinks','Cola','Soda','Tonic'] },
      { key: 'water', label: 'Water', children: ['Mineral','Sparkling'] },
    ]
  },
  // Frozen
  { key: 'frozen', label: 'Frozen Foods', children: [{ key: 'vegfrozen', label: 'Frozen Veg', children: ['Frozen Peas','French Fries'] }] },
  // Personal Care
  { key: 'beauty', label: 'Beauty & Hygiene', children: [ { key: 'pcare', label: 'Personal Care', children: ['Shampoo','Soap','Toothpaste'] }, { key: 'skincare', label: 'Skin Care', children: ['Face Wash', 'Moisturizers'] } ] },
  // Household
  { key: 'household', label: 'Cleaning & Household', children: [ { key: 'cleaning', label: 'Home Cleaning', children: ['Dishwash Liquid','Floor Cleaner','Garbage Bags'] }, { key: 'detergent', label: 'Detergents', children: ['Powder', 'Liquid'] } ] },
  // Baby & Pet
  { key: 'baby', label: 'Baby Care', children: [{ key: 'diapers', label: 'Diapers & Wipes', children: ['Baby Diapers','Baby Wipes'] }] },
  { key: 'pet', label: 'Pet Care', children: [{ key: 'dog', label: 'Dog Care', children: ['Dog Food','Dog Treats'] }] },
  // Non-veg
  { key: 'meat', label: 'Eggs, Meat & Fish', children: [{ key: 'chicken', label: 'Chicken', children: ['Breast', 'Leg'] }] },
];

export default function CategoryMegaMenu({ open, onClose }) {
  const [activeTop, setActiveTop] = useState(DATA[0].key)
  const [activeMid, setActiveMid] = useState(DATA[0].children[0].key)

  const topCategories = DATA
  const midCategories = useMemo(() => topCategories.find(c => c.key === activeTop)?.children || [], [activeTop])
  const leafItems = useMemo(() => midCategories.find(c => c.key === activeMid)?.children || [], [midCategories, activeMid])

  if (!open) return null

  return (
    <div className="absolute left-0 top-full mt-2 z-40 flex w-[min(900px,95vw)] rounded-lg overflow-hidden shadow-xl">
      {/* Left rail */}
      <div className="w-64 bg-[#FAFAFA] text-brand-teal max-h-[60vh] overflow-auto border-r border-brand-steel/30">
        {topCategories.map(c => (
          <button
            key={c.key}
            onMouseEnter={() => { setActiveTop(c.key); setActiveMid((c.children?.[0]?.key) || '') }}
            className={`w-full text-left px-4 py-3 hover:bg-[#FF0038]/10 ${activeTop===c.key ? 'bg-[#FF0038]/10' : ''}`}
          >{c.label}</button>
        ))}
      </div>
      {/* Middle column */}
      <div className="flex-1 bg-[#FAFAFA] p-4 border-r border-brand-steel/30">
        <div className="grid gap-1">
          {midCategories.map(m => (
            <button
              key={m.key}
              onMouseEnter={() => setActiveMid(m.key)}
              className={`text-left px-3 py-2 rounded ${activeMid===m.key ? 'bg-[#FF0038]/10' : 'bg-transparent'}`}
            >{m.label}</button>
          ))}
        </div>
      </div>
      {/* Right column */}
      <div className="w-72 bg-[#FAFAFA] p-4">
        <div className="grid gap-2">
          {leafItems.map((l, idx) => (
            <Link key={idx} to={`/products?q=${encodeURIComponent(l)}`} className="px-3 py-2 rounded hover:bg-[#FF0038]/10">{l}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}
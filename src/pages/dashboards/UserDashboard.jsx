import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import CategoryMegaMenu from '../../components/CategoryMegaMenu';
import OffersButton from '../../components/OffersButton';

// Offer card component
const OfferCard = ({ title, subtitle, to = "/offers" }) => (
  <Link to={to} className="rounded-lg overflow-hidden border bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block">
    <div className="bg-[#FF0038] text-white px-4 py-6 h-28 flex items-end font-semibold text-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 animate-pulse"></div>
      <div className="relative z-10">
        <div>{title}</div>
        {subtitle && (
          <div className="text-sm font-normal opacity-90">{subtitle}</div>
        )}
      </div>
    </div>
  </Link>
);

// Category tile component
const CategoryTile = ({ title, img }) => (
  <Link
    to="/products"
    className="flex items-center gap-4 p-4 rounded-lg border bg-white hover:shadow-sm transition"
  >
    <img src={img} alt={title} className="w-16 h-16 object-cover rounded" />
    <div className="font-medium">{title}</div>
  </Link>
);

// Footer Links Section
const LinksSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 text-gray-500 text-sm border-t border-gray-100 mt-12">
    {/* Useful Links */}
    <div className="md:col-span-1">
      <h3 className="font-bold text-gray-800 mb-4 text-base">Useful Links</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
        <div className="flex flex-col gap-3">
          <Link to="#" className="hover:text-gray-800 transition-colors">Blog</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Privacy</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Terms</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">FAQs</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Security</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Contact</Link>
        </div>
        <div className="flex flex-col gap-3">
          <Link to="#" className="hover:text-gray-800 transition-colors">Partner</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Franchise</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Seller</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Warehouse</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Deliver</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Resources</Link>
        </div>
        <div className="flex flex-col gap-3">
          <Link to="#" className="hover:text-gray-800 transition-colors">Recipes</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Bistro</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">District</Link>
        </div>
      </div>
    </div>

    {/* Categories */}
    <div className="md:col-span-3">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-bold text-gray-800 text-base">Categories</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2">
        <div className="flex flex-col gap-3">
          <Link to="/category/vegetables" className="hover:text-gray-800 transition-colors">Vegetables & Fruits</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Cold Drinks & Juices</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Bakery & Biscuits</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Dry Fruits, Masala & Oil</Link>
        </div>
        <div className="flex flex-col gap-3">
          <Link to="#" className="hover:text-gray-800 transition-colors">Dairy & Breakfast</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Instant & Frozen Food</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Sweet Tooth</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Sauces & Spreads</Link>
        </div>
        <div className="flex flex-col gap-3">
          <Link to="#" className="hover:text-gray-800 transition-colors">Munchies</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Tea, Coffee & Milk Drinks</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Atta, Rice & Dal</Link>
          <Link to="#" className="hover:text-gray-800 transition-colors">Chicken, Meat & Fish</Link>
        </div>
      </div>
    </div>
  </div>
);

// Main homepage component
export default function HomePage() {
  const { role } = useSelector(s => s.auth)
  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrapRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuOpen) return;
      if (menuWrapRef.current && !menuWrapRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      {/* Buttons row below navbar */}


      {/* Grocery & Kitchen Grid */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Grocery & Kitchen</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            { title: 'Fresh Vegetables', img: '/images/fresh-vegetables.jpg', link: '/category/vegetables' },
            { title: 'Fresh Fruits', img: '/images/fruits.jpg', link: '/category/fruits' },
            { title: 'Dairy, Bread and Eggs', img: '/images/dairy_bread_eggs.png', link: '/category/dairy-bread-eggs' },
            { title: 'Cereals and Breakfast', img: '/images/cereals_breakfast.png', link: '/category/cereals-breakfast' },
            { title: 'Atta, Rice and Dal', img: '/images/atta_rice_dal.png', link: '/category/atta-rice-dal' },
            { title: 'Oils and Ghee', img: '/images/oils_ghee.png', link: '/category/oils-ghee' },
            { title: 'Masalas', img: '/images/herbs-seasonings.jpg', link: '/category/masalas' },
            { title: 'Dry Fruits and Seeds Mix', img: '/images/dry_fruits.png', link: '/category/dry-fruits-seeds' },
            { title: 'Biscuits and Cakes', img: '/images/biscuits_cakes.png', link: '/category/biscuits-cakes' },
            { title: 'Tea, Coffee and Milk drinks', img: '/images/tea_coffee.png', link: '/category/tea-coffee' },
            { title: 'Sauces and Spreads', img: '/images/sauces_spreads.png', link: '/category/sauces-spreads' },
            { title: 'Meat and Seafood', img: '/images/meat_seafood.png', link: '/category/meat-seafood' },
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="group flex flex-col items-center gap-3"
            >
              <div className="w-full aspect-square bg-white rounded-3xl flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100 transition-all duration-300 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] group-hover:border-[#FF0038]/20 group-hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover relative z-10"
                />
              </div>
              <span className="text-center text-sm font-bold text-gray-700 leading-tight group-hover:text-[#FF0038] transition-colors">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured section (hidden for admin) */}
      {role !== 'admin' && (
        <LinksSection />
      )}
    </div>
  );
}

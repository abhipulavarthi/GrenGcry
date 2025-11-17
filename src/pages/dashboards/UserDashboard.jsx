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

// Carousel section
function Carousel() {
  const BASE = import.meta?.env?.BASE_URL || '/';
  const IMGS = [1, 2, 3, 4, 5, 6].map((n) => `${BASE}images/${n}.png`);

  const [idx, setIdx] = useState(0);
  const wrapRef = useRef(null);
  const [w, setW] = useState(935); // default width
  const ratio = 331 / 935;

  // Auto-slide
  useEffect(() => {
    const id = setInterval(() => {
      setIdx((v) => (v + 1) % IMGS.length);
    }, 3000); // slower for better UX
    return () => clearInterval(id);
  }, [IMGS.length]);

  // Resize handler (with debounce)
  useEffect(() => {
    let timeout;
    const recalc = () => {
      if (wrapRef.current) {
        const cw = wrapRef.current.clientWidth;
        if (cw && Math.abs(cw - w) > 1) setW(cw);
      }
    };
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(recalc, 150);
    };
    recalc();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [w]);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden rounded-lg border bg-white w-full"
      style={{ height: w ? Math.round(w * ratio) : 300 }}
    >
      <div
        className="flex h-full transition-transform duration-[1500ms] ease-in-out"
        style={{
          width: w * IMGS.length,
          transform: `translateX(-${idx * w}px)`,
        }}
      >
        {IMGS.map((src, i) => (
          <div
            key={i}
            className="flex items-center justify-center"
            style={{ width: w, height: Math.round(w * ratio) }}
          >
            <img
              src={src}
              alt={`Slide ${i + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

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
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div ref={menuWrapRef} className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="blob-btn blob-btn--coffee"
              >
                <span className="blob-btn__inner">
                  <span className="blob-btn__blobs">
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                  </span>
                </span>
                Shop by Category
              </button>
              {menuOpen && (
                <CategoryMegaMenu
                  open={menuOpen}
                  onClose={() => setMenuOpen(false)}
                />
              )}
            </div>
            {role === 'admin' && (
              <Link
                to="/orders"
                className="blob-btn blob-btn--orders"
                title="View all user orders"
              >
                <span className="blob-btn__inner">
                  <span className="blob-btn__blobs">
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                  </span>
                </span>
                All Orders
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <OffersButton className="blob-btn--offers" />
            <Link to="/products" className="blob-btn blob-btn--products">
              <span className="blob-btn__inner">
                <span className="blob-btn__blobs">
                  <span className="blob-btn__blob"></span>
                  <span className="blob-btn__blob"></span>
                  <span className="blob-btn__blob"></span>
                  <span className="blob-btn__blob"></span>
                </span>
              </span>
              All Products
            </Link>
          </div>
        </div>
      </div>

      {/* Offers section */}
      <section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/category/cleaning-household"
            className="rounded-xl overflow-hidden border bg-white relative group hover:shadow-md transition"
          >
            <img
              className="w-full h-full aspect-[16/9] object-cover"
              src="/images/hos.jpg"
              alt="Cleaning & Household"
            />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <span className="inline-block px-3 py-1 rounded-md bg-[#FAFAFA]/60 text-gray-900 font-medium group-hover:bg-[#FAFAFA]">
                Cleaning & Household
              </span>
            </div>
          </Link>
          <Link
            to="/category/icecreams"
            className="rounded-xl overflow-hidden border bg-white relative group hover:shadow-md transition"
          >
            <img
              className="w-full h-full aspect-[16/9] object-cover"
              src="/images/ice.jpg"
              alt="Ice Creams"
            />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <span className="inline-block px-3 py-1 rounded-md bg-[#FAFAFA]/60 text-gray-900 font-medium group-hover:bg-[#FAFAFA]">
                Ice Creams
              </span>
            </div>
          </Link>
          <Link
            to="/category/chocolates"
            className="rounded-xl overflow-hidden border bg-white relative group hover:shadow-md transition"
          >
            <img
              className="w-full h-full aspect-[16/9] object-cover"
              src="/images/choc.jpg"
              alt="Chocolates"
            />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <span className="inline-block px-3 py-1 rounded-md bg-[#FAFAFA]/60 text-gray-900 font-medium group-hover:bg-[#FAFAFA]">
                Chocolates
              </span>
            </div>
          </Link>
          <Link
            to="/category/beverages"
            className="rounded-xl overflow-hidden border bg-white relative group hover:shadow-md transition"
          >
            <img
              className="w-full h-full aspect-[16/9] object-cover"
              src="/images/tin.jpg"
              alt="Beverages"
            />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <span className="inline-block px-3 py-1 rounded-md bg-[#FAFAFA]/60 text-gray-900 font-medium group-hover:bg-[#FAFAFA]">
                Beverages
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Category tiles section */}
      <section className="mt-8">
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/category/seasonal"
            className="rounded-xl overflow-hidden border bg-white relative group hover:shadow-md transition"
          >
            <img
              className="w-full h-full aspect-[16/9] object-cover"
              src="/images/seasonal.jpg"
              alt="Seasonal Fruits & Vegetables"
            />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <span className="inline-block px-3 py-1 rounded-md bg-[#FAFAFA]/60 text-gray-900 font-medium group-hover:bg-[#FAFAFA]">
                Fruits & Vegetables
              </span>
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/category/vegetables"
              className="rounded-xl overflow-hidden border bg-white relative group hover:shadow-md transition"
            >
              <img
                className="w-full h-full aspect-[16/9] object-cover"
                src="/images/fresh-vegetables.jpg"
                alt="Vegetables"
              />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <span className="inline-block px-3 py-1 rounded-md bg-[#FAFAFA]/60 text-gray-900 font-medium group-hover:bg-[#FAFAFA]">
                  Vegetables
                </span>
              </div>
            </Link>

            <Link
              to="/category/fruits"
              className="rounded-xl overflow-hidden border bg-white relative group hover:shadow-md transition"
            >
              <img
                className="w-full h-full aspect-[16/9] object-cover"
                src="/images/fruits.jpg"
                alt="Fruits"
              />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <span className="inline-block px-3 py-1 rounded-md bg-[#FAFAFA]/60 text-gray-900 font-medium group-hover:bg-[#FAFAFA]">
                  Fruits
                </span>
              </div>
            </Link>

            <Link
              to="/category/herbs-seasonings"
              className="rounded-xl overflow-hidden border bg-white relative group hover:shadow-md transition"
            >
              <img
                className="w-full h-full aspect-[16/9] object-cover"
                src="/images/herbs-seasonings.jpg"
                alt="Herbs & Seasonings"
              />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <span className="inline-block px-3 py-1 rounded-md bg-[#FAFAFA]/60 text-gray-900 font-medium group-hover:bg-[#FAFAFA]">
                  Herbs & Seasonings
                </span>
              </div>
            </Link>

            <Link
              to="/category/snacks-branded-foods"
              className="rounded-xl overflow-hidden border bg-white relative group hover:shadow-md transition"
            >
              <img
                className="w-full h-full aspect-[16/9] object-cover"
                src="/images/snacks.jpg"
                alt="Snacks & Branded Foods"
              />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <span className="inline-block px-3 py-1 rounded-md bg-[#FAFAFA]/60 text-gray-900 font-medium group-hover:bg-[#FAFAFA]">
                  Snacks & Branded Foods
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured section (hidden for admin) */}
      {role !== 'admin' && (
        <section className="mt-8">
          <Carousel />
        </section>
      )}
    </div>
  );
}

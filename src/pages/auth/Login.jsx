import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { loginSuccess } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });
  const [DotLottieCmp, setDotLottieCmp] = useState(null);

  useEffect(() => {
    let mounted = true;
    import('@lottiefiles/dotlottie-react').then(m => {
      if (mounted) setDotLottieCmp(() => m.DotLottieReact);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Disable page scroll while on the login page
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  // Simplified UI: no role toggle or role label shown on the form

  const onSubmit = async (data) => {
    try {
      // 1. Call the login API endpoint using the named function from your api.js file
      const res = await api.login(data);
      
      // 2. Extract the user's role from the successful API response
      const { role } = res.data || {};
      const normalizedRole = (role || '').toLowerCase();

      // 3. Dispatch the data to the Redux store to update the global state
      dispatch(loginSuccess(res.data));
      toast.success('Logged in');

      // 4. Navigate to the correct page based on the user's role
      // 
      if (normalizedRole === 'admin') {
        // If the user is an admin, navigate to the admin dashboard path
        navigate('/admin', { replace: true });
      } else {
        // For customers, navigate to their intended page or the homepage
        navigate(from, { replace: true });
      }
      
    } catch (e) {
      const status = e.response?.status;
      if (status === 401) {
        toast.error('Wrong password');
      } else if (status === 404) {
        toast.error('User not found');
      } else {
        toast.error(e.response?.data?.message || 'Login failed');
      }
    }
  };

  return (
    <div className="mx-auto p-8 h-screen overflow-hidden flex items-center justify-center" style={{ width: 1012.57 }}>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="flex items-center justify-center">
          {DotLottieCmp && (
            <DotLottieCmp src="/animations/preparing-food.lottie" loop autoplay style={{ width: 480, height: 480 }} />
          )}
        </div>
        <div className="text-[17px]">
          <h1 className="text-3xl font-semibold mb-5">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block mb-2 text-lg">Email</label>
              <input className="w-full border rounded px-4 py-3 text-lg bg-transparent" {...register('email')} />
              {errors.email && <p className="text-sm text-brand-brown">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block mb-2 text-lg">Password</label>
              <input type="password" className="w-full border rounded px-4 py-3 text-lg bg-transparent" {...register('password')} />
              {errors.password && <p className="text-sm text-brand-brown">{errors.password.message}</p>}
            </div>
            <button disabled={isSubmitting} className="w-full py-3 text-lg bg-[#FF0038] text-white rounded-full">{isSubmitting ? '...' : 'Login'}</button>
          </form>
          <p className="text-base mt-4">No account? <Link to="/signup" className="text-[#FF0038]">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}
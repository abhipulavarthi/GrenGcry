import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

export default function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });
  const [DotLottieCmp, setDotLottieCmp] = useState(null);

  useEffect(() => {
    let mounted = true;
    import('@lottiefiles/dotlottie-react').then(m => {
      if (mounted) setDotLottieCmp(() => m.DotLottieReact);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Disable page scroll while on the signup page
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const onSubmit = async (data) => {
    try {
      // THE FIX: Call the named 'register' function from your api object
      await api.register(data);
      
      toast.success('Account created, please login');
      navigate('/login');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="mx-auto p-8 h-screen overflow-hidden flex items-center justify-center" style={{ width: 1012.57 }}>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="flex items-center justify-center">
          {DotLottieCmp && (
            <DotLottieCmp src="/animations/cook.lottie" loop autoplay style={{ width: 480, height: 480 }} />
          )}
        </div>
        <div className="text-[17px]">
          <h1 className="text-3xl font-semibold mb-5">Sign Up</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block mb-2 text-lg">Name</label>
              <input className="w-full border rounded px-4 py-3 text-lg bg-transparent" {...register('name')} />
              {errors.name && <p className="text-sm text-brand-brown">{errors.name.message}</p>}
            </div>
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
            <button disabled={isSubmitting} className="w-full py-3 text-lg bg-[#FF0038] text-white rounded-full">{isSubmitting ? '...' : 'Create account'}</button>
          </form>
          <p className="text-base mt-4">Have an account? <Link to="/login" className="text-[#FF0038]">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
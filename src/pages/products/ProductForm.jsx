import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import { toast } from 'react-toastify'

const schema = yup.object({
  name: yup.string().required(),
  category: yup.string().required(),
  price: yup.number().min(0).required(),
  stock: yup.number().min(0).required(),
  unitType: yup.string().oneOf(['kg', 'pcs']).optional(),
  image: yup.string().url().nullable().optional()
})

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, reset, setValue, getValues, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) })

  const handleNameBlur = (e) => {
    const name = e.target.value
    const currentImg = getValues('image')
    if (name && !currentImg) {
      const url = `https://image.pollinations.ai/prompt/fresh ${encodeURIComponent(name)} fruit vegetable grocery?nologo=true`
      setValue('image', url)
    }
  }

  useEffect(() => {
    const load = async () => {
      if (!id) return
      try {
        const res = await api.getProduct(id)
        const p = res.data
        reset(p)
        const txt = Array.isArray(p.unitOptions) ? p.unitOptions.map(o => `${o.label} | ${o.multiplier}`).join('\n') : ''
        setValue('unitOptionsText', txt)
      } catch { toast.error('Failed to load product') }
    }
    load()
  }, [id, reset])

  const onSubmit = async (data) => {
    try {
      // parse unit options from textarea if provided
      const text = (data.unitOptionsText || '').trim()
      let unitOptions
      if (text) {
        unitOptions = text.split(/\r?\n/).map(line => {
          const [labelPart, multPart] = line.split('|')
          const label = String(labelPart || '').trim()
          const multiplier = Number(String(multPart || '').trim() || '1')
          if (!label) return null
          return { label, multiplier: isNaN(multiplier) ? 1 : multiplier }
        }).filter(Boolean)
      }
      const payload = { ...data, unitOptions }
      delete payload.unitOptionsText
      if (id) await api.updateProduct(id, payload)
      else await api.createProduct(payload)
      toast.success('Saved')
      navigate('/products')
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Save failed'
      toast.error(msg)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">{id ? 'Edit' : 'Add'} Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input className="w-full border rounded px-3 py-2 bg-transparent" {...register('name', { onBlur: handleNameBlur })} />
          {errors.name && <p className="text-sm text-brand-brown">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Category</label>
          <input className="w-full border rounded px-3 py-2 bg-transparent" {...register('category')} />
          {errors.category && <p className="text-sm text-brand-brown">{errors.category.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-1">Price</label>
            <input type="number" step="0.01" className="w-full border rounded px-3 py-2 bg-transparent" {...register('price')} />
            {errors.price && <p className="text-sm text-brand-brown">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block mb-1">Stock</label>
            <input type="number" className="w-full border rounded px-3 py-2 bg-transparent" {...register('stock')} />
            {errors.stock && <p className="text-sm text-brand-brown">{errors.stock.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-1">Unit Type</label>
            <select className="w-full border rounded px-3 py-2 bg-transparent" {...register('unitType')} defaultValue="kg">
              <option value="kg">Weight (g/kg)</option>
              <option value="pcs">Pieces</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Custom Unit Options</label>
            <textarea rows="3" className="w-full border rounded px-3 py-2 bg-transparent" placeholder="e.g.\n250 g | 0.25\n1 kg | 1\n2 kg | 2" {...register('unitOptionsText')}></textarea>
            <p className="text-xs text-gray-600 mt-1">Format: one per line as “label | multiplier”. Leave empty to use defaults by unit type.</p>
          </div>
        </div>
        <div>
          <label className="block mb-1">Image URL</label>
          <input className="w-full border rounded px-3 py-2 bg-transparent" {...register('image')} />
        </div>
        <button disabled={isSubmitting} className="px-4 py-2 bg-[#0014A8] text-white rounded-full">{isSubmitting ? '...' : 'Save'}</button>
      </form>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../../services/api'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'

const schema = yup.object({
  productId: yup.mixed().required(),
  rating: yup.number().min(1).max(5).required(),
  comment: yup.string().required(),
})

export default function Feedback() {
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) })
  const { role, user } = useSelector(s => s.auth)
  const isAdmin = role === 'admin'

  useEffect(() => {
    (async () => {
      try {
        const p = await api.getProducts()
        setProducts(p.data || [])
      } catch {}
      try {
        const f = await api.getFeedback()
        setReviews(f.data || [])
      } catch {}
    })()
  }, [])

  const onSubmit = async (data) => {
    try {
      const productId = Number(data.productId)
      const payload = { rating: Number(data.rating), comment: data.comment }
      await api.createProductFeedback(productId, payload)
      toast.success('Thanks for your feedback!')
      reset()
      try {
        const f = await api.getProductFeedbacks(productId)
        // backend may wrap list in .items for PagedResponse
        setReviews(f.data?.items || f.data || [])
      } catch {}
    } catch (e) { toast.error(e?.response?.data?.message || 'Submit failed') }
  }

  const shownReviews = role === 'admin'
    ? reviews.filter(r => {
        const uid = user?.id || user?._id || user?.uid
        const uemail = user?.email
        return (
          r?.userId !== uid &&
          r?.user?.id !== uid &&
          r?.user?._id !== uid &&
          r?.user !== uid &&
          r?.userEmail !== uemail &&
          r?.email !== uemail
        )
      })
    : reviews

  return (
    <div className={isAdmin ? "" : "grid md:grid-cols-2 gap-6"}>
      {!isAdmin && (
      <div>
        <h1 className="text-2xl font-semibold mb-4">Leave a Review</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block mb-1">Product</label>
            <select className="w-full border rounded px-3 py-2 bg-transparent" {...register('productId')}>
              <option value="">Select</option>
              {products.map(p => <option value={p.id} key={p.id}>{p.name}</option>)}
            </select>
            {errors.productId && <p className="text-sm text-brand-brown">{errors.productId.message}</p>}
          </div>
          <div>
            <label className="block mb-1">Rating (1-5)</label>
            <input type="number" min="1" max="5" className="w-full border rounded px-3 py-2 bg-transparent" {...register('rating')} />
            {errors.rating && <p className="text-sm text-brand-brown">{errors.rating.message}</p>}
          </div>
          <div>
            <label className="block mb-1">Comment</label>
            <textarea rows="4" className="w-full border rounded px-3 py-2 bg-transparent" {...register('comment')} />
            {errors.comment && <p className="text-sm text-brand-brown">{errors.comment.message}</p>}
          </div>
          <button disabled={isSubmitting} className="px-4 py-2 bg-[#FF0038] text-white rounded">{isSubmitting ? '...' : 'Submit'}</button>
        </form>
      </div>
      )}
      {role === 'admin' && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Recent Reviews</h2>
          <div className="space-y-3">
            {shownReviews.map((r, idx) => (
              <div key={idx} className="border rounded p-3 dark:border-gray-800">
                <div className="font-medium">{r.productName || r.productId}</div>
                <div className="text-brand-sand">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                <p className="text-sm mt-1">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

import { Suspense } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from './routes'
import Loader from './components/Loader'

function App() {
  const router = createBrowserRouter(routes, {
    future: { v7_startTransition: true }
  })
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App

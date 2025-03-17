import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {createBrowserRouter,RouterProvider} from 'react-router-dom'

import SupInitial from './pages/supervisor/SupInitial';

const router=createBrowserRouter(
  [
    {
      path:"/SInitial",
      element:<SupInitial/>
    }
  ]
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)

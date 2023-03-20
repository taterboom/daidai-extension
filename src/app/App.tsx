import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements
} from "react-router-dom"

import "./styles/globals.css"
import "./styles/editor.css"
import "./styles/daysiui-enhance.css"

import { Toaster } from "react-hot-toast"

import Desktop from "./Desktop"

const router = createHashRouter(
  createRoutesFromElements(<Route path="/" element={<Desktop />}></Route>)
)

const App = () => (
  <>
    <Toaster />
    <RouterProvider router={router}></RouterProvider>
  </>
)

export default App

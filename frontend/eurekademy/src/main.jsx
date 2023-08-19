import ReactDOM from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import router from './Router.jsx';
import { MyContextProvider } from './context/ContextProvider.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
    <MyContextProvider>
        <RouterProvider router={router} />
    </MyContextProvider>
);

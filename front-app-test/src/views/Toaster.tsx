import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type ToasterType = "success" | "error" | "warning"

interface Toast {
    message?: string;
    type?: ToasterType;
}

interface ToasterProps {
    toast: Toast;
}

function Toaster(props: ToasterProps) {

    const { toast: toastToDisplay } = props;

    useEffect(() => {
        if (toast) {
            console.log(toastToDisplay, "coucou");
            switch (toastToDisplay.type) {
                case "success":
                    toast.success(toastToDisplay.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        });
                    break;
                case "error":
                    toast.error(toastToDisplay.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        });
                    break;
                case "warning":
                    toast.warning(toastToDisplay.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        });
                    break;
            }
        }
        
    }, [toastToDisplay]);


    return (
        <ToastContainer
            position="top-right"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
    );
}
export default Toaster;
import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MyContext } from "../../context/ContextProvider";

const VerificationPage = () => {
    // const navigate = useNavigate();
    const { baseUrl } = useContext(MyContext);
    const { token } = useParams();
    // const [verify, setVerify] = useState(null); // Initialize state as null

    // const handleRedirectToLogin = () => {
    //     navigate("/auth/login");
    // };

    const verifyAccount = () => {
        console.log(token);
        if (token) {
            fetchVerification();
        }
    };

    const fetchVerification = async () => {
        await axios
            .post(baseUrl + "/verify/" + token)
            .then((res) => {
                console.log(res);
                console.log("verfikasi berhasil");
            })
            .catch((error) => {
                console.log(error);
                console.log("verfikasi gagal");
            });
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
                <p className="text-center text-xl font-semibold mb-4">
                    Akun Anda berhasil diverifikasi.
                </p>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    onClick={verifyAccount}
                >
                    Oke
                </button>
            </div>
        </div>
    );
};

export default VerificationPage;

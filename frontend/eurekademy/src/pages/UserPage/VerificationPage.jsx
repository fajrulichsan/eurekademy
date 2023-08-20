import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MyContext } from "../../context/ContextProvider";

const VerificationPage = () => {
    const { baseUrl } = useContext(MyContext);
    const { token } = useParams();
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);
    const [wrongToken, setWrongToken] = useState(false);

    useEffect(() => {
        if (token) {
            getVerification();
        }
    }, []);

    const getVerification = async () => {
        await axios
            .get(baseUrl + "/verify/" + token)
            .then((res) => {
                console.log(res.data.verification);
                if (res.data.verification) {
                    setIsVerified(true);
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response.data.message) {
                    setWrongToken(true);
                }
            });
    };

    const verification = async () => {
        await axios
            .post(baseUrl + "/verify/" + token)
            .then(() => {
                setIsVerified(true);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleRedirectToLogin = () => {
        navigate("/auth/login");
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
                <p className="text-center text-xl font-semibold mb-4">
                    {isVerified
                        ? "Akun Anda sudah berhasil diverifikasi."
                        : wrongToken
                        ? "Token tidak valid. Silakan coba lagi."
                        : "Akun Anda belum diverifikasi."}
                </p>
                {isVerified ? (
                    <button
                        className="bg-blue-500 mx-auto text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        onClick={handleRedirectToLogin}
                    >
                        Oke
                    </button>
                ) : (
                    !wrongToken && (
                        <button
                            className="bg-blue-500 mx-auto text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                            onClick={() => verification()}
                        >
                            Verifikasi
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default VerificationPage;

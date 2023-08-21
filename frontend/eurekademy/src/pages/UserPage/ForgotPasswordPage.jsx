import { useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { MyContext } from "../../context/ContextProvider";

const ForgotPassword = () => {
    const { baseUrl } = useContext(MyContext);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError("Please enter a valid email address.");
            return;
        }
        console.log("reset");
        await axios
            .post(baseUrl + "/auth/forgot-password", {
                email: email,
            })
            .then((res) => {
                console.log(res);
                 Swal.fire({
                     icon: "success",
                     title: "Berhasil",
                     text: res.data.message,
                 });

            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: error.response.data.message,
                });
                console.log(error);
            });
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Email:
                        </label>
                        <input
                            type="email"
                            className={`mt-1 px-4 py-2 border rounded-md w-full focus:ring focus:ring-blue-300 ${
                                emailError ? "border-red-500" : ""
                            }`}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError("");
                            }}
                            required
                        />
                        {emailError && (
                            <p className="mt-1 text-red-500">{emailError}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;

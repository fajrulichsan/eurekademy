import { useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MyContext } from "../../context/ContextProvider";

const ResetPasswordPage = () => {
    const { baseUrl } = useContext(MyContext);
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Password and confirmation do not match");
            return;
        }

        await axios
            .post(baseUrl + "/auth/reset-password", {
                password: password,
                token: token,
            })
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full sm:w-96">
                <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">New Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Reset Password
                    </button>
                </form>
                <p className="mt-4 text-red-600">{message}</p>
            </div>
        </div>
    );
};

export default ResetPasswordPage;

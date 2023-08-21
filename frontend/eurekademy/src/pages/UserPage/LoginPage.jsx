import axios from "axios";
import Swal from "sweetalert2";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    const { baseUrl } = useContext(MyContext);
    const [showPassword, setShowPassword] = useState(false);
    const [availableLogin, setAvailableLogin] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [login, setLogin] = useState({
        email: "",
        password: "",
    });

    const onInputLogin = (e) => {
        const { name, value } = e.target;
        setLogin((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        refreshAlertMessage();
        if (validationSignUp()) {
            await axios
                .post(baseUrl + `/user/${login.email}/${login.password}`)
                .then((res) => {
                    console.log(res);
                    navigate("/dashboard");
                })
                .catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Gagal",
                        text: error.response.data.message,
                    });
                });
        }
    };

    const validationSignUp = () => {
        var isValid = true;

        if (String(login.email).length == 0) {
            setEmailErrorMessage("Email field cannot be empty");
            isValid = false;
        } else if (!isValidEmail(String(login.email))) {
            console.log(isValidEmail(login.email));
            setEmailErrorMessage("Invalid email format");
            isValid = false;
        }

        if (String(login.password).length == 0) {
            setPasswordErrorMessage("Password field cannot be empty");
            isValid = false;
        }

        return isValid;
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return emailRegex.test(email);
    };

    const refreshAlertMessage = () => {
        setEmailErrorMessage("");
        setPasswordErrorMessage("");
    };

    useEffect(() => {
        const result = Object.values(login).every(
            (field) => String(field).length !== 0
        );
        setAvailableLogin(result);
    }, [login]);
    return (
        <div>
            {console.log(login)}
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            <div className="space-y-4 md:space-y-6">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Your email
                                    </label>
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="example@gmail.com"
                                        onChange={(e) => onInputLogin(e)}
                                    />
                                    {emailErrorMessage && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {emailErrorMessage}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        onChange={(e) => onInputLogin(e)}
                                    />
                                    {passwordErrorMessage && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {passwordErrorMessage}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-between justify-between">
                                    <div className="flex gap-2">
                                        <input
                                            type="checkbox"
                                            htmlFor="showPassword"
                                            onChange={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                        ></input>
                                        <label
                                            id="showPassword"
                                            className="block text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Show password
                                        </label>
                                    </div>
                                    <a
                                        href="/auth/forgot-password"
                                        className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <button
                                    type="submit"
                                    className={` ${
                                        availableLogin
                                            ? "bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300"
                                            : "bg-blue-100"
                                    } w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                                    disabled={availableLogin ? false : true}
                                    onClick={() => handleSubmit()}
                                >
                                    Sign in
                                </button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet?{" "}
                                    <a
                                        href="/auth/signup"
                                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                    >
                                        Sign up
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LoginPage;

import { Fragment, useState } from "react";

const SignUpPage = () => {
    const [signUpData, setSignUpData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [nameErrorMessage, setNameErrorMessage] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
        useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [availableSignUp, setAvailableSignUp] = useState(false);

    const signUp = [
        {
            name: "name",
            value: signUpData.name,
        },
        {
            name: "email",
            value: signUpData.email,
        },
        {
            name: "password",
            value: signUpData.password,
        },
        {
            name: "confirmPassword",
            value: signUpData.confirmPassword,
        },
    ];

    const errorAlertList = [
        {
            name: "name",
            value: nameErrorMessage,
            setValue: setNameErrorMessage,
        },
        {
            name: "email",
            value: emailErrorMessage,
            setValue: setEmailErrorMessage,
        },
        {
            name: "password",
            value: passwordErrorMessage,
            setValue: setPasswordErrorMessage,
        },
        {
            name: "confirmPassword",
            value: confirmPasswordErrorMessage,
            setValue: setConfirmPasswordErrorMessage,
        },
    ];

    const onInputSignUp = (e) => {
        const { name, value } = e.target;
        setSignUpData((prevSignUpData) => ({
            ...prevSignUpData,
            [name]: value,
        }));

        

        const allErrorsEmpty = signUp.every(
            (field) => String(field.value).length != 0
        );

        if (allErrorsEmpty) {
            setAvailableSignUp(true);
        } else {
            setAvailableSignUp(false);
        }

        if (name === "confirmPassword") {
            if (String(signUpData.password).length != 0) {
                if (signUpData.password != value) {
                    setConfirmPasswordErrorMessage("Passwords do not match");
                    setAvailableSignUp(false);
                } else {
                    setConfirmPasswordErrorMessage("");
                }
            }
        }

    
        const fieldToUpdate = errorAlertList.find(
            (field) => field.name === name
        );
        if (fieldToUpdate) {
            fieldToUpdate.setValue("");
        }
    };

    const handleSubmit = () => {
        refreshAlertMessage();
        if (validationSignUp()){
            console.log("berhasil")
        }else{
            console.log("gagal");
        }
    };

    const validationSignUp = () => {
        var isValid = true;
        if (
            (String(signUpData.name).length < 3) &
            (String(signUpData.name).length > 0)
        ) {
            setNameErrorMessage("Name must be at least 3 characters");
            isValid = false;
        } else if (String(signUpData.name).length == 0) {
            setNameErrorMessage("Name field cannot be empty");
            isValid = false
        }

        if (String(signUpData.email).length == 0) {
            setEmailErrorMessage("Email field cannot be empty");
            isValid = false
        } else if (!isValidEmail(String(signUpData.email))) {
            console.log(isValidEmail(signUpData.email));
            setEmailErrorMessage("Invalid email format");
            isValid = false
        }

        if (String(signUpData.password).length == 0) {
            setPasswordErrorMessage("Password field cannot be empty");
            isValid = false
        } else if (String(signUpData.password).length < 8) {
            setPasswordErrorMessage("Name must be at least 8 characters");
            isValid = false
        }

        if(signUpData.confirmPassword != signUpData.password){
            setConfirmPasswordErrorMessage("Passwords do not match");
            isValid = false
        }

        return isValid;
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return emailRegex.test(email);
    };

    const refreshAlertMessage = () => {
        setNameErrorMessage("");
        setEmailErrorMessage("");
        setPasswordErrorMessage("");
        setConfirmPasswordErrorMessage("");
    };

    return (
        <Fragment>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Create and account
                            </h1>
                            <div className="space-y-4 md:space-y-6">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Your Name"
                                        onChange={(e) => onInputSignUp(e)}
                                    />
                                    {nameErrorMessage && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {nameErrorMessage}
                                        </p>
                                    )}
                                </div>
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
                                        onChange={(e) => onInputSignUp(e)}
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
                                        onChange={(e) => onInputSignUp(e)}
                                    />
                                    {passwordErrorMessage && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {passwordErrorMessage}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="confirm-password"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Confirm password
                                    </label>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="confirmPassword"
                                        id="confirm-password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        onChange={(e) => onInputSignUp(e)}
                                    />
                                    {confirmPasswordErrorMessage && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {confirmPasswordErrorMessage}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="checkbox"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                    ></input>
                                    <label
                                        htmlFor="confirm-password"
                                        className="block text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Show password
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className={` ${
                                        availableSignUp
                                            ? "bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300"
                                            : "bg-blue-100"
                                    } w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                                    onClick={() => handleSubmit()}
                                    disabled={availableSignUp ? false : true}
                                >
                                    Create an account
                                </button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Already have an account?{" "}
                                    <a
                                        href="/auth/login"
                                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                    >
                                        Login here
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    );
};

export default SignUpPage;

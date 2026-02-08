import FormInput from "../../components/input/FormInput";
import {UserRound, Mail, Lock} from 'lucide-react';
import InputErrorMessage from "../../components/error/InputErrorMessage";
import { useState } from "react";

function UserRegister() {

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>(''); 
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const validateName = (name: string) => {
        return name.length >= 5 && name.length <= 20; 
    }

    const validatePassword = (password: string) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    }

    const validateConfirmPassword = (confirmPassword: string) => { 
        return confirmPassword === password;
    }

    return (
            <div className="h-screen w-screen bg-white">
            <img src="/Logo.png" alt="Register" className="block mt-[15px] ml-[14px]"/>

            <div className="flex flex-col w-screen h-auto justify-center items-center mt-[10px]">
                <h1 className="text-2xl font-bold">Create Account</h1>
                <p className="text-xs font-normal text-[var(--color-lightgray)]">Join For Fun & Start Sharing</p>
            </div>

            <div className="flex flex-col w-screen h-auto mt-[15px]">
                {/* Form Component */}
                <form className="flex flex-col w-[343px] h-auto mt-[20px] mx-auto">
                    <p className="text-[var(--color-lightgray)] font-bold">NAME</p>
                    <FormInput Icon={UserRound} placeholder="Your Name" type="text" value={name} onValidate={validateName} errorMessage={InputErrorMessage("Name must be 5-20 characters!")} onChange={(name) => setName(name)}></FormInput>
                    <p className="mt-[17px] text-[var(--color-lightgray)] font-bold">EMAIL</p>
                    <FormInput Icon={Mail} placeholder="ex:johndoe@gmail.com" type="email" value={email} onChange={(email) => setEmail(email)} onValidate={validateEmail} errorMessage={InputErrorMessage("Please enter an valid email")}></FormInput>
                    <p className="mt-[17px] text-[var(--color-lightgray)] font-bold">PASSWORD</p>
                    <FormInput Icon={Lock} placeholder="Create strong password" type="password" onValidate={validatePassword} value={password} onChange={(password) => setPassword(password)} errorMessage={InputErrorMessage("Password must contain symbol, uppercase, lowercase, and at least 8 characters")}></FormInput>
                    <p className="mt-[17px] text-[var(--color-lightgray)] font-bold">CONFIRM PASSWORD</p>
                    <FormInput Icon={Lock} placeholder="Confirm your password" type="password" onValidate={validateConfirmPassword} value={confirmPassword} onChange={(confirmPassword) => setConfirmPassword(confirmPassword)} errorMessage={InputErrorMessage("Password doesn't match")}></FormInput>
                    <button className="text-white font-bold text-base mt-[20px] w-full h-10 bg-[var(--fun-color-primary)] rounded-lg flex justify-center items-center active:shadow-inner transition-all duration-100 brightness-100 active:brightness-90">Create Account</button>
                </form>
            </div>
            <div className="flex flex-col w-screen h-auto justify-center items-center">
                <p className="mt-[15px]">Already have an account? <a href="/login" className="text-[var(--fun-color-primary)]">Login</a></p>
            </div>
        </div>
    )
}

export default UserRegister;
import FormInput from "../../components/input/FormInput";
import {Mail, Lock} from 'lucide-react';
import { useState } from 'react';

function UserLogin (){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="h-screen w-screen bg-white">
            <img src="/Logo.png" alt="Register" className="block mt-[15px] ml-[14px]"/>
            <div className="flex flex-col w-screen h-auto justify-center items-center mt-[10px]">
                <h1 className="text-2xl font-bold">Welcome Back!</h1>
                <p className="text-xs font-normal text-[var(--color-lightgray)]">Ready to split some bills?</p>
            </div>
            <div className="flex flex-col w-screen h-auto mt-[15px]">
                {/* Form Component */}
                <form className="flex flex-col w-[343px] h-auto mt-[20px] mx-auto">
                    <p className="text-[var(--color-lightgray)] font-bold">EMAIL</p>
                    <FormInput Icon={Mail} placeholder="Email" type="email" value={email} onChange={(email) => setEmail(email)}></FormInput>
                    <p className="mt-[17px] text-[var(--color-lightgray)] font-bold">PASSWORD</p>
                    <FormInput Icon={Lock} placeholder="Password" type="password" value={password} onChange={(password) => setPassword(password)}></FormInput>
                    <button className="text-white font-bold text-base mt-[20px] w-full h-10 bg-[var(--fun-color-primary)] rounded-lg flex justify-center items-center active:shadow-inner transition-all duration-100 brightness-100 active:brightness-90">Login</button>
                </form>
            </div>
            <div className="flex flex-col w-screen h-auto justify-center items-center">
                <p className="mt-[15px]">Don't have an account? <a href="/register" className="text-[var(--fun-color-primary)]">Sign Up</a></p>
            </div>
        </div>
    )
}

export default UserLogin;
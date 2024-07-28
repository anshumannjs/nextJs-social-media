"use client"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Button as ButtonNextUi } from "@nextui-org/button"
import { Input as InputNextUi } from "@nextui-org/input"
import { useState, useEffect } from "react"

import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon"
import { EyeFilledIcon } from "./EyeFiilledIcon"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useSession, signIn, signOut } from "next-auth/react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"

type formFields = {
    email: string,
    password: string
}

export default function LoginForm(props: { toggleLoginForm: () => void, className: string, toggleForgotPassword: () => void, toggleLoading: (value: boolean) => void }) {
    const { register, handleSubmit, formState } = useForm<formFields>()
    const session = useSession();
    console.log(session)

    const { toggleLoginForm, toggleForgotPassword }: { toggleLoginForm: () => void, toggleForgotPassword: () => void } = props

    const [isVisible, setIsVisible] = useState(false)

    const toggleVisibility = () => setIsVisible(!isVisible);

    const { mutate, data, isPending } = useMutation({
        mutationFn: (data: formFields) => postUser(data),
        onSuccess: (data) => console.log(data)
    })
    useEffect(()=>{
        props.toggleLoading(isPending)
      },[isPending])

    const onSubmit: SubmitHandler<formFields> = async (data) => {
        console.log(data)
        mutate(data)
    }

    async function postUser(data: formFields) {
        const result = await signIn("credentials", { ...data, redirect: false })
        return result;
    }

    return (
        <motion.div
            className="h-[100vh]"
            initial={{
                x: -100,
                opacity: 0
            }}
            whileInView={{
                x: 0,
                opacity: 1,
            }}
            transition={{
                duration: 0.5
            }}
        >
            <div className={cn("flex items-center justify-center py-12", props.className)}>
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-2">
                            <InputNextUi
                                id="email"
                                type="email"
                                label="Email"
                                labelPlacement="outside"
                                isClearable
                                isRequired
                                variant="underlined"
                                {...register("email", { required: "This is required" })}
                            />
                            <div className="text-red-600">
                                {formState.errors.email?.message}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <div
                                    className="ml-auto inline-block text-sm underline cursor-pointer"
                                    onClick={toggleForgotPassword}
                                >
                                    Forgot your password?
                                </div>
                            </div>
                            <InputNextUi
                                id="password"
                                type={isVisible ? "text" : "password"}
                                isRequired
                                variant="underlined"
                                label="Password"
                                labelPlacement="outside"
                                endContent={
                                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                        {isVisible ? (
                                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                    </button>
                                }
                                {...register("password", { required: "This is required" })}
                            />
                            <div className="text-red-600">
                                {formState.errors.password?.message}
                            </div>
                        </div>
                        <ButtonNextUi type="submit" variant="shadow" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 font-bold text-white text-lg">
                            Login
                        </ButtonNextUi>
                        <ButtonNextUi variant="shadow" onClick={()=>signIn("google")} className="w-full bg-gradient-to-r from-white to-cyan-200 border border-cyan-400 font-bold text-medium">
                            Login with Google
                        </ButtonNextUi>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <span onClick={toggleLoginForm} className="underline cursor-pointer">
                            Sign up
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

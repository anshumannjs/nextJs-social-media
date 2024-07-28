"use client"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Button as ButtonNextUi } from "@nextui-org/button"
import { Input as InputNextUi } from "@nextui-org/input"
import { useEffect, useState } from "react"

import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon"
import { EyeFilledIcon } from "./EyeFiilledIcon"
import { SignupForm } from "./SignUpForm"
import LoginForm from "./LoginForm"

import { motion } from 'framer-motion'
import { ForgotPassword } from "./ForgotPassword/ForgotPassword"
import { signOut, useSession } from "next-auth/react"
import { Spinner } from "@nextui-org/spinner"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/spinnerDialog"
import { useRouter } from "next/navigation"

export default function LoginSignup() {
  const route=useRouter()
  const {status}=useSession()

  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const toggleLoginForm = () => setIsLogin(!isLogin);
  const toggleForgotPassword = () => setIsForgotPassword(!isForgotPassword)
  const toggleLoading = (value: boolean) => setIsLoading(value)

  useEffect(()=>{
    if(status==="authenticated"){
      route.push("/")
    }
  },[status])

  return (
    <div className="w-full lg:grid lg:max-h-[100vh] lg:grid-cols-2 xl:max-h-[100vh]">
      <div className="overflow-y-auto scrollbar-hide">
        {
          isForgotPassword ? (
            <ForgotPassword toggleForgotPassword={toggleForgotPassword} toggleLoading={toggleLoading} />
          ) : (
            isLogin ? (
              <LoginForm toggleLoginForm={toggleLoginForm} toggleLoading={toggleLoading} toggleForgotPassword={toggleForgotPassword} className={""} />
            ) :
              (
                <SignupForm className={"flex items-center justify-center"} toggleLoading={toggleLoading} toggleLoginForm={toggleLoginForm} />
              )
          )
        }
        <Dialog open={isLoading}>
          <DialogContent>
            <Spinner
              color="success"
              size="lg"
            />
          </DialogContent>
        </Dialog>
        {status=="authenticated"?
        <div onClick={()=>signOut()}>sign Out</div>
      :""}
      </div>

      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

    </div>
  )
}

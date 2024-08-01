"use client"
import { Button as ButtonNextUi } from "@nextui-org/button"
import { Input as InputNextUi } from "@nextui-org/input"
import { Progress as ProgressNextUi } from "@nextui-org/react"
import { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

import { EyeFilledIcon } from "../EyeFiilledIcon"
import { EyeSlashFilledIcon } from "../EyeSlashFilledIcon"

export function ForgotPassword({ toggleForgotPassword, toggleLoading }: { toggleForgotPassword: () => void, toggleLoading: (value: boolean) => void }) {
  const [isVisible, setIsVisible] = useState(false)

  const [email, setEmail]=useState("")
  const toggleVisibility = () => setIsVisible(!isVisible);
  const arrComponents = [EnterEmail, CheckMail]
  const [component, setComponent] = useState(EnterEmail({email, setEmail}))
  const [step, setStep] = useState(1)

  const toggleComponents = () => { setStep(step + 1) }

  const {mutate}=useMutation({
    mutationFn: ()=>postEmail(email),
    onSuccess: (data)=>{toggleComponents()},
    onMutate: ()=>console.log("hello")
  })

  async function postEmail(email: string){
    const result=await fetch("/api/auth/forgotPassword",{
      body: JSON.stringify({email}),
      method: "POST"
    })
    const fetchData=await result.json();
    return fetchData;
  }

  return (
    <motion.div
      className="h-[100vh] space-y-10"
      initial={{
        x: -100,
        opacity: 0
      }}
      whileInView={{
        x: 0,
        opacity: 1
      }}
      transition={{
        duration: 0.5
      }}>
        {/* @ts-ignore */}
      <ProgressNextUi label={`Step ${step}/2`}
        size="md"
        value={step * 50}
        color="success"
        showValueLabel={true}
        className="max-w-md mx-auto mt-5"
      />

      <div className={cn("flex items-center justify-center py-12")}>
        <div className="mx-auto grid w-[350px] gap-6">
          {arrComponents[step - 1]({ email, setEmail })}
          <div className="grid gap-4">
            {
              step == 2 ? "" :
                <ButtonNextUi onClick={()=>mutate()} type="submit" variant="shadow" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 font-bold text-white text-lg">
                  Continue
                </ButtonNextUi>
            }
            <ButtonNextUi onClick={toggleForgotPassword} variant="shadow" className="w-full bg-gradient-to-r from-white to-cyan-200 border border-cyan-400 font-bold text-medium">
              Back to Sign in
            </ButtonNextUi>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function CheckMail({email}: {email: string}) {
  return (
    <div className="grid gap-2 text-center">
      <h1 className="text-3xl font-bold">Check Your Mail</h1>
      <p className="text-balance text-muted-foreground">
        We sent a link for reset password to {email}
      </p>
    </div>
  )
}

function EnterEmail({email, setEmail}: {email: string, setEmail: any}) {
  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-balance text-muted-foreground">
          No Worries, we'll handle it.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <InputNextUi
            id="email"
            type="email"
            label="Email"
            labelPlacement="outside"
            isClearable
            isRequired
            variant="underlined"
            value={email}
            onValueChange={setEmail}
          />
        </div>
      </div>
    </>
  )
}

function SetPassword({ toggleVisibility, isVisible }: { toggleVisibility: () => void, isVisible: boolean}) {

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Set new password</h1>
        <p className="text-balance text-muted-foreground">
          Must be at least 8 characters.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
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
          />
        </div>
        <div className="grid gap-2">
          <InputNextUi
            id="reEnterPassword"
            type={isVisible ? "text" : "password"}
            isRequired
            variant="underlined"
            label="Re-enter Password"
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
          />
        </div>
      </div>
    </>
  )
}

function AllDone() {
  return (
    <div className="grid gap-2 text-center">
      <h1 className="text-3xl font-bold">All Done</h1>
      <p className="text-balance text-muted-foreground">
        Your password has been successfully updated.
      </p>
    </div>
  )
}

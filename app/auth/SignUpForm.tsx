import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Button as ButtonNextUi } from "@nextui-org/button"
import { Input as InputNextUi } from "@nextui-org/input"
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon"
import { EyeFilledIcon } from "./EyeFiilledIcon"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { FormEvent, useEffect, useState } from "react"
import {SubmitHandler, useForm } from "react-hook-form"
import { useQuery, useMutation } from "@tanstack/react-query"

type formFields={
  firstName: string,
  lastName: string,
  email: string,
  userName: string,
  password: string
}

export function SignupForm(props: { className: any, toggleLoginForm: () => void, toggleLoading: (value: boolean) => void }) {
  const {register, handleSubmit, formState} =useForm<formFields>()

  const { className, toggleLoginForm }: { className: any, toggleLoginForm: () => void } = props
  const [isVisible, setIsVisible] = useState(false)
  const [isVisibleReEnter, setIsVisibleReEnter] = useState(false)
  const [password, setPassword]=useState("")

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibilityReEnter=()=>setIsVisibleReEnter(!isVisibleReEnter)

  const {mutate, data, isPending} =useMutation({
    mutationFn: (data: formFields)=>postUser(data),
    onSuccess: (data)=> console.log(data)
  })
  useEffect(()=>{
    props.toggleLoading(isPending)
  },[isPending])

  const onSubmit: SubmitHandler<formFields>=async (data)=>{
    console.log(data)
    // const result=await fetch("/api/auth/register", {
    //   body: JSON.stringify(data),
    //   method: "POST",
    // }).then((e)=>e.json()).then((e)=>console.log(e))
    mutate(data)
  }
  async function postUser(data: formFields){
    console.log(data)
    const result=await fetch("/api/auth/register", {
      body: JSON.stringify(data),
      method: "POST",
    })
    const fetchData=await result.json()
    console.log(fetchData)
    return fetchData
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
        opacity: 1
      }}
      transition={{
        duration: 0.5
      }}>
      <div className={className}>
        <Card className={cn("mx-auto max-w-sm border-none")}>
          <CardHeader>
          <h1 className="text-3xl font-bold">Sign Up</h1>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <InputNextUi
                    id="firstName"
                    label="First Name"
                    labelPlacement="outside"
                    isClearable
                    variant="underlined"
                    isRequired
                    {...register("firstName", {required: "This is required"})}
                  />
                  <div className="text-red-600">
                  {formState.errors.firstName?.message}
                  </div>
                </div>
                <div className="grid gap-2">
                  <InputNextUi
                    id="lastName"
                    label="Last Name"
                    labelPlacement="outside"
                    isClearable
                    isRequired
                    variant="underlined"
                    {...register("lastName", {required: "This is required"})}
                  />
                  <div className="text-red-600">
                  {formState.errors.lastName?.message}
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <InputNextUi
                  id="userName"
                  type="userName"
                  label="User Name"
                  labelPlacement="outside"
                  isRequired
                  variant="underlined"
                  isClearable
                  {...register("userName", {required: "This is required"})}
                />
                <div className="text-red-600">
                  {formState.errors.userName?.message}
                  </div>
              </div>
              <div className="grid gap-2">
                <InputNextUi
                  id="email"
                  type="email"
                  variant="underlined"
                  label="Email"
                  labelPlacement="outside"
                  isClearable
                  isRequired
                  {...register("email", {required: "This is required", pattern: {value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, message: "This is not an email"}})}
                />
                <div className="text-red-600">
                  {formState.errors.email?.message}
                  </div>
              </div>
              <div className="grid gap-2">
                <InputNextUi
                  id="password"
                  type={isVisible ? "text" : "password"}
                  isRequired
                  variant="underlined"
                  label="Password | Must be at least 8 characters long"
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
                  {...register("password", {required: "This is required", minLength: {value: 8, message: "Must be at least 8 characters long"}, validate: {matchPassword: (value)=>value==password?true:"Password is not same"}})}
                />
                <div className="text-red-600">
                  {formState.errors.password?.message}
                  </div>
              </div>
              <div className="grid gap-2">
                <InputNextUi
                  id="rePassword"
                  type={isVisibleReEnter ? "text" : "password"}
                  isRequired
                  variant="underlined"
                  label="Re enter password"
                  labelPlacement="outside"
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibilityReEnter}>
                      {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  value={password}
                  onValueChange={setPassword}
                  />
              </div>
              <ButtonNextUi type="submit" variant="shadow" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 font-bold text-white text-lg">
                Create an account
              </ButtonNextUi>
              <ButtonNextUi variant="shadow" className="w-full bg-gradient-to-r from-white to-cyan-200 border border-cyan-400 font-bold text-medium">
                Sign up with Google
              </ButtonNextUi>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <span onClick={toggleLoginForm} className="underline cursor-pointer">
                Sign in
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

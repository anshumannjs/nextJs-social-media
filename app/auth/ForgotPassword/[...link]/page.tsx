"use client"

import { Button as ButtonNextUi } from "@nextui-org/button"
import { Input as InputNextUi } from "@nextui-org/input"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"

import { EyeSlashFilledIcon } from "../../EyeSlashFilledIcon"
import { EyeFilledIcon } from "../../EyeFiilledIcon"

export default function SetPassword({params}: {params: {link: string[]}}) {
    const userId=params.link[0]
    const token=params.link[1]
    console.log(userId, token)

    const [isVisible, setIsVisible] = useState(false)
    const [isReVisible, setIsReVisible] = useState(false)
    const [password, setPassword]=useState("")
    const [rePassword, setRePassword]=useState("")

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleReVisibility = () => setIsReVisible(!isReVisible);

  const {mutate}=useMutation({
    mutationFn: ()=>postPassword(password),
    onSuccess: (data)=>console.log(data)
  })

  async function postPassword(password: string){
    const result=await fetch(`/api/auth/forgotPassword/${userId}/${token}`,{
      body: JSON.stringify({password}),
      method: "POST"
    })
    const fetchData=await result.json();
    return fetchData;
  }

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
              value={password}
              onValueChange={setPassword}
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
                <button className="focus:outline-none" type="button" onClick={toggleReVisibility}>
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              value={rePassword}
              onValueChange={setRePassword}
            />
          </div>
          <button onClick={()=>mutate()}>Submit</button>
        </div>
      </>
    )
  }
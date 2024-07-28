"use client"
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProfileUploader from "@/components/ProfileUploader";
import { Loader } from "lucide-react";
import { restrictedClient } from "@/lib/restrictedClient";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// import { ProfileValidation } from "@/lib/validation";
// import { useUserContext } from "@/context/AuthContext";
// import { useGetUserById, useUpdateUser } from "@/lib/react-query/queries";

const UpdateProfile = ({params}: {params: {profileId: string}}) => {
  const { toast } = useToast();
  const id = params.profileId
  restrictedClient(id).then((e)=>console.log(e))
  const session=useSession()
  const user=session.data?.user
  console.log(user)
  const [defaultValues, setDefaultValues]=useState({
    file: [],
    firstName: user?.firstName,
    userName: user?.userName,
    email: user?.email,
    bio: user?.bio,
    lastName: user?.lastName
  })
  useEffect(()=>{
    setDefaultValues({
      file: [],
      firstName: user?.firstName,
      userName: user?.userName,
      email: user?.email,
      bio: user?.bio,
      lastName: user?.lastName
    })
  },[user])
  console.log(defaultValues)
  const form = useForm({
    // resolver: zodResolver(ProfileValidation),
    defaultValues
  });

  // Queries
  // const { data: currentUser } = {data: {}}
  // const { mutateAsync: updateUser, isLoading: isLoadingUpdate } ={mutateAsync: (value: any)=>console.log(value), isLoading: false} // useUpdateUser();

  if (session.status==="loading")
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  // Handler
  const handleUpdate = async (value: any) => {
    // const updatedUser = await updateUser({
    //   userId: "currentUser.$id",
    //   name: value.name,
    //   bio: value.bio,
    //   file: value.file,
    //   imageUrl: "currentUser.imageUrl",
    //   imageId: "currentUser.imageId",
    // });

    if ("!updatedUser" && false) {
      toast({
        title: `Update user failed. Please try again.`,
      });
    }

    // setUser({
    //   ...user,
    //   name: "updatedUser?.name",
    //   bio: "updatedUser?.bio",
    //   imageUrl: "updatedUser?.imageUrl",
    // });
    // return navigate(`/profile/${id}`);
  };

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <Image
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className=""
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={user?.image||""}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">First Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      className="shad-textarea custom-scrollbar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => console.log("navigate(-1)")}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                // disabled={isLoadingUpdate}
                >
                {/* {isLoadingUpdate && <Loader />} */}
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;

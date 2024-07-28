"use client"
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { PostValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import FileUploader from "../FileUploader";
import { useRouter } from "next/navigation";
import { uploadToSupabaseFromClient } from "@/utils/clientFileUpload";
import { useMutation } from "@tanstack/react-query";
import { POST } from "@/app/api/chat/route";

type PostFormProps = {
  post?: any;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const route = useRouter()
  const { toast } = useToast();
  const user = {}
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  // Query
  const { mutateAsync: createPost, isLoading: isLoadingCreate } = { isLoading: false, mutateAsync: (value: any) => console.log(value) } // useCreatePost();
  const { mutateAsync: updatePost, isLoading: isLoadingUpdate } = { isLoading: false, mutateAsync: (value: any) => console.log(value) } // useUpdatePost();

  const { mutate, data, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof PostValidation>) => handleUpload(data),
    onSuccess: (data) => console.log(data)
  })

  const handleUpload = async (value: z.infer<typeof PostValidation>) => {
    // ACTION = UPDATE
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...value,
        postId: post.$id,
        imageId: post.imageId,
        imageUrl: post.imageUrl,
      });


      //   if (!updatedPost) {
      //     toast({
      //       title: `${action} post failed. Please try again.`,
      //     });
      //   }
      //   return navigate(`/posts/${post.$id}`);
    }
    else{
      const formData = new FormData()
      formData.append("caption", value.caption)
      formData.append("tags", value.tags)
      formData.append("location", value.location)
      value.file.forEach((value) => {
        formData.append("file", value)
      })
      fetch("/api/post", {
        method: "POST",
        body: formData
      }).then((res) => res.json()).then((e) => {
        console.log(e)
      })
    }

  }

  // Handler
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    mutate(value)

    // ACTION = CREATE
    const newPost = await createPost({
      ...value,
      userId: "user.id",
    });

    // if (!newPost) {
    //   toast({
    //     title: `${action} post failed. Please try again.`,
    //   });
    // }
    // navigate("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Caption</FormLabel>
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

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
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
            className=""
            onClick={() => route.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isPending}>
            {isPending && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;

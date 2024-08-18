"use client";
import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { sandMessageSchema } from "@/schemas/sandMessageSchema";
import { IApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const SandMessage = () => {
  const [isSubmitingMessage, setIsSubmitingMessage] = useState(false);
  const [error, setError] = useState("");
  const [fetchSuggestedMessage, setFetchSuggestedMessage] = useState([]);
  const [isFetchingSuggestedMessage, setIsFetchingSuggestedMessage] =
    useState(false);
  const { username } = useParams();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof sandMessageSchema>>({
    resolver: zodResolver(sandMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof sandMessageSchema>) => {
    setIsSubmitingMessage(true);
    setError("");
    try {
      const response = await axios.post<IApiResponse>("/api/sand-message", {
        username,
        content: data.content,
      });
      if (response.data.success) {
        toast({
          title: "message sent successfully",
          description: response.data.message,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse>;
      console.log("Error sanding message", axiosError.response.data.message);
      toast({
        title: "failed to sand message",
        description: axiosError.response.data.message,
      });
    } finally {
      setIsSubmitingMessage(false);
    }
  };
  return (
    <div className="my-16 py-16">
      <div className="container mx-auto  sm:w-[60%]">
        <div className="mx-auto text-center my-4">
          <h2 className="text-3xl sm:text-4xl font-semibold pb-2">
            Start writting your feedback{" "}
          </h2>
          <h1 className=" text-2xl sm:text-3xl font-semibold">
            for {username}
          </h1>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-8 ">
              <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Write Message</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="sand message here"
                        {...field}
                        className="border-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-center my-4">
                <Button
                  variant={"default"}
                  className="w-1/2  "
                  type="submit"
                  disabled={isSubmitingMessage}
                >
                  {isSubmitingMessage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SandMessage;

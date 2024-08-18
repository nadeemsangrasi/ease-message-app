"use client";
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
import { toast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { IApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const VerifyCode = () => {
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState("");
  const router = useRouter();
  const params = useParams();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setVerifyingCode(true);
    setVerifyMessage("");
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });
      if (response.status == 200) {
        setVerifyMessage(response.data.message);
        toast({
          title: "user verified successfully",
          description: response.data.message,
          variant: "destructive",
        });
        router.replace("/sign-in");
      }
    } catch (error) {
      console.error("Error in verifying user", error);
      const axiosError = error as AxiosError<IApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Verifying failed",
        description: errorMessage,
        variant: "destructive",
      });
      setVerifyMessage(errorMessage!);
    } finally {
      setVerifyingCode(false);
    }
  };
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Verify Your Account
            </h1>
            <p className="mb-4">
              Enter the verification code sent to your email
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                name="code"
                control={form.control}
                render={(field) => (
                  <FormItem>
                    <FormLabel>Verify Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter verification code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant={"secondary"}
                type="submit"
                disabled={verifyingCode}
              >
                {verifyingCode ? (
                  <>
                    Verifying code...
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  "Verify code"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;

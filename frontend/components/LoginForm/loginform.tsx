"use client"

import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.'}).trim(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }).max(80, {
    message: "Password must be less than 80 characters."
  })
});

function LoginForm() {
  const { push } = useRouter();
  const [csrfToken, setCsrfToken] = useState("");

  // Fetch CSRF token when the component mounts
  useEffect(() => {
    fetch("http://localhost:4000/api/get-csrf-token", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setCsrfToken(data.csrf_token); // assuming your backend sends the token in { csrf_token: '...'}
        console.log(data.csrf_token);
      })
      .catch((err) => console.error("Error fetching CSRF token:", err));
  }, []);

  // Defining form defaults
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    let request = {
      method: 'POST',
      headers: { 'Content-Type': 'appliaction/json',
                 'X-CSRF-TOKEN': csrfToken
       },
      body: JSON.stringify({ "email": values.email,
                             "password": values.password,
      })
    }

    fetch('http://localhost:4000/login', request)
    .then(response => response.json()
    .then(data => ({
      data: data,
      response: response
    })).then(res => {
      if (res.response.ok) {
        push('/')
      }
      else {
        console.log("Something went wrong");
      }
    }))
  }

  return (
    <div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" method="post">
      <input type="hidden" name="csrf-token" value="{{ csrf_token() }}"/>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" 
                       required 
                       type="email" 
                       {...field}/>
              </FormControl>
              <FormDescription>
                Enter your email here
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Password"
                       required
                       type="password"
                       {...field}/>
              </FormControl>
              <FormDescription>
                Enter your password here
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default LoginForm
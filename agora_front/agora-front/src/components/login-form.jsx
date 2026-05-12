import { useState } from "react" // Problem 1: This was missing
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import loginImage from "@/assets/register_img.png"

export function LoginForm({ className, ...props }) {
  // State for email and password
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Problem 2: handleChange must be its own separate function
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  // Problem 3: handleSubmit was stuck inside handleChange. Fixed.
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Added trailing slash / for Django
      const response = await fetch(
        "http://127.0.0.1:8000/api/utilisateurs/check_login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await response.json()

      // Check the 'ok' key from your Django response
      if (data.ok === true) {
        alert("Login successful!")
      } else {
        alert("Invalid email or password")
      }
    } catch (error) {
      console.error("Connection error:", error)
      alert("Could not reach the server.")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Agora account
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                {/* Problem 4: password field was missing value and onChange */}
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <Button type="submit" className="w-full">Login</Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-3 gap-4">
                 <Button variant="outline" type="button">Apple</Button>
                 <Button variant="outline" type="button">Google</Button>
                 <Button variant="outline" type="button">Meta</Button>
              </div>

              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="/register" className="underline">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src={loginImage}
              alt="Background"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

const integrationFormSchema = z.object({
  emailService: z.boolean(),
  emailApiKey: z.string().optional(),
  smsService: z.boolean(),
  smsApiKey: z.string().optional(),
  calendarSync: z.boolean(),
  calendarApiKey: z.string().optional(),
  paymentGateway: z.boolean(),
  paymentApiKey: z.string().optional(),
})

type FormValues = z.infer<typeof integrationFormSchema>

export function IntegrationSettings() {
  const form = useForm<FormValues>({
    resolver: zodResolver(integrationFormSchema),
    defaultValues: {
      emailService: true,
      emailApiKey: "sk_test_123",
      smsService: false,
      smsApiKey: "",
      calendarSync: true,
      calendarApiKey: "cal_123",
      paymentGateway: true,
      paymentApiKey: "pk_test_123",
    },
  })

  async function onSubmit(data: FormValues) {
    console.log(data)
    const response = await fetch('/api/integration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const result = await response.json()
    console.log(result)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Settings</CardTitle>
        <CardDescription>
          Configure external service integrations and API keys.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="emailService"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Email Service</FormLabel>
                      <FormDescription>
                        Integration with email service provider.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch("emailService") && (
                <FormField
                  control={form.control}
                  name="emailApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Service API Key</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="smsService"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">SMS Service</FormLabel>
                      <FormDescription>
                        Integration with SMS provider for notifications.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch("smsService") && (
                <FormField
                  control={form.control}
                  name="smsApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMS Service API Key</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="calendarSync"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Calendar Sync</FormLabel>
                      <FormDescription>
                        Sync with external calendar services.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch("calendarSync") && (
                <FormField
                  control={form.control}
                  name="calendarApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calendar API Key</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="paymentGateway"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Payment Gateway</FormLabel>
                      <FormDescription>
                        Integration with payment processing service.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch("paymentGateway") && (
                <FormField
                  control={form.control}
                  name="paymentApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Gateway API Key</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Save Integration Settings</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
} 
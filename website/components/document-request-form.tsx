"use client"

import { FileText, Plus } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import DynamicFormField from "./dynamic-form-field"
import { generateSchema, servicesContractFields, powerOfAttorneyFields, nonDisclosureAgreementFields } from "@/utils/documentsFields"

import { useForm, SubmitHandler } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/contexts/auth-context"

interface DocumentTemplate {
  id: string
  title: string
  description: string
  estimatedTime: string
}

const documentTemplates: DocumentTemplate[] = [
  {
    id: "services-contract",
    title: "Services Contract",
    description: "Hire an individual or company to work for you",
    estimatedTime: "1-2 weeks",
  },
  {
    id: "power-of-attorney",
    title: "Power of Attorney",
    description: "Legal authorization for someone to act on your behalf in specified matters",
    estimatedTime: "3-5 days",
  },
  {
    id: "non-disclosure-agreement",
    title: "Non-Disclosure Agreement",
    description: "Protect confidential information shared between parties",
    estimatedTime: "1-2 weeks",
  },
]

const lawyersList: any[] = [
  {
    id: "0x01d671a993ed2560bf2e9bfe4c8041ef8af54b631db849bf5767dbae846fdf4f",
    title: "Robert Ramirez",
    description: "Divorce lawyer with +5 years of experience",
    estimatedTime: "1 week",
    price: "$50/document",
  },
  {
    id: "0x02d671a993ed2560bf2e9bfe4c8041ef8af54b631db849bf5767dbae846fdf4f",
    title: "Jane Doe",
    description: "Real estate lawyer specializing in property transfer deeds",
    estimatedTime: "1-2 weeks",
    price: "$90/document",
  },
  {
    id: "0x03d671a993ed2560bf2e9bfe4c8041ef8af54b631db849bf5767dbae846fdf4f",
    title: "John Smith",
    description: "Experienced attorney for power of attorney matters",
    estimatedTime: "3-5 days",
    price: "$40/document",
  },
]

export const DocumentsRequestForm = () => {
  const { login, logout, loginWithWallet, user } = useAuth()
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [selectedLawyer, setSelectedLawyer] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Determine the schema and fields based on the selected template
  let personalInfoFormSchemaCustom;
  let dynamicFields;
  switch (selectedTemplate) {
    case "services-contract":
      personalInfoFormSchemaCustom = generateSchema(servicesContractFields);
      dynamicFields = servicesContractFields;
      break;
    case "power-of-attorney":
      personalInfoFormSchemaCustom = generateSchema(powerOfAttorneyFields);
      dynamicFields = powerOfAttorneyFields;
      break;
    case "non-disclosure-agreement":
      personalInfoFormSchemaCustom = generateSchema(nonDisclosureAgreementFields);
      dynamicFields = nonDisclosureAgreementFields;
      break;
    default:
      personalInfoFormSchemaCustom = generateSchema(servicesContractFields); // Default or fallback schema
      dynamicFields = servicesContractFields;
  }

  const infoSchema = personalInfoFormSchemaCustom

  const form = useForm<z.infer<typeof infoSchema>>({
    resolver: zodResolver(infoSchema),
    mode: 'onBlur',
    defaultValues: {
      id: "",
      name: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      country: "CR",
    },
  })
  const { setValue, handleSubmit, watch, register, formState, getValues, trigger, reset } = form;

  const onSubmit: SubmitHandler<z.infer<typeof infoSchema>> = async (values) => {
    setIsSubmitting(true);
    try {
      // Get the selected lawyer's price
      const selectedLawyerData = lawyersList.find((l) => l.id === selectedLawyer);
      const price = selectedLawyerData?.price || '0';
      const numericPrice = parseInt(price.replace(/[^0-9]/g, ''));

      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-type': 'client', // Assuming this is for a regular user
          'user-id': user?.walletAddress || '', // Using the id from the form values
        },
        body: JSON.stringify({
          type: selectedTemplate,
          lawyer: selectedLawyer,
          user_id: user?.walletAddress,
          input: {
            ...values,
            template: selectedTemplate,
          },
          amount: numericPrice,
          currency: 'USD',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const data = await response.json();
      console.log('Success:', data);
      
      // Close the modal and reset form
      setIsRequestModalOpen(false);
      reset();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <Button onClick={() => setIsRequestModalOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Request Document
      </Button>

      {/* Request New Document Modal */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="max-w-2xl h-[90%]">
          <DialogHeader>
            <DialogTitle>Request New Document</DialogTitle>
            <DialogDescription>
              Select a document type and provide additional details for your request
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-6 overflow-y-auto">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 ">
                <div>
                  <div className="">
                    <div className="space-y-4">
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {selectedTemplate && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle>{documentTemplates.find((t) => t.id === selectedTemplate)?.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p className="text-sm">{documentTemplates.find((t) => t.id === selectedTemplate)?.description}</p>
                          </CardContent>
                        </Card>
                      )}

                      <Select value={selectedLawyer} onValueChange={setSelectedLawyer}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lawyer" />
                        </SelectTrigger>
                        <SelectContent>
                          {lawyersList.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {selectedLawyer && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle>{lawyersList.find((t) => t.id === selectedLawyer)?.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p className="text-sm">{lawyersList.find((t) => t.id === selectedLawyer)?.description}</p>
                            <div className="mt-4 flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Estimated time: {lawyersList.find((t) => t.id === selectedLawyer)?.estimatedTime}
                              </span>
                              <span className="font-medium">
                                {lawyersList.find((t) => t.id === selectedLawyer)?.price}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {dynamicFields && (
                        <div className='!mt-[10px]'>
                          {dynamicFields.map((item: any, index: number) => (
                            <DynamicFormField key={`${item.fieldName}-${index}`} form={form} fieldConfig={item} />
                          ))}
                        </div>
                      )}

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Additional Details</h4>
                        <Textarea
                          {...register('additionalDetails')}
                          placeholder="Please provide any specific requirements or details for your document request..."
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
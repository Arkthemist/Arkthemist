import React, { useEffect, useMemo } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select as ShadSelect, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DynamicFormFieldProps {
  fieldConfig: any
  form: any
  userInfo?: any
  isAdmin?: boolean
}

const DynamicFormField = ({ fieldConfig, form, userInfo, isAdmin }: DynamicFormFieldProps) => {
  const { control, setValue, watch, trigger, formState: { errors } } = form;
  const value = watch(fieldConfig.id);

  const renderField = () => {
    switch (fieldConfig.type) {
      case 'select':
        return (
          <ShadSelect onValueChange={(value) => setValue(fieldConfig.id, value)} defaultValue={value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={fieldConfig.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{fieldConfig.label}</SelectLabel>
                {fieldConfig.options.map((option: any, index: number) => (
                  <SelectItem key={index} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </ShadSelect>
        );

      case 'email':
        return (
          <div>
            <div className='flex flex-col md:flex-row gap-3'>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className={` ${userInfo?.email ? 'w-full' : 'w-1/2'}`}>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={'Email'}
                        {...field}
                        //disabled={userInfo?.email != null}
                        disabled={isAdmin ? false : userInfo?.email != null}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!userInfo?.email && <FormField
                control={form.control}
                name="confirmEmail"
                render={({ field }) => (
                  <FormItem className='w-1/2'>
                    <FormLabel>Confirm Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={'Confirm email'}
                        {...field}
                        disabled={userInfo?.confirmEmail != null}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />}
            </div>
            {!userInfo?.email && !userInfo?.confirmEmail && <p className='text-sm mt-1'>Please use the same email on both fields</p>}
          </div>
        )
      default:
        return (
          <Input
            placeholder={fieldConfig.placeholder}
            {...form.register(fieldConfig.id)}
          />
        );
    }
  };

  return (
    <FormField
      control={control}
      name={fieldConfig.id}
      render={({ field }) => (
        <FormItem className="mt-2">
          {fieldConfig.type !== "email" && <FormLabel>{fieldConfig.name}{fieldConfig.isRequired ? '*' : ''}</FormLabel>}
          <FormControl>
            {renderField()}
          </FormControl>
          <FormMessage>{errors[fieldConfig.id]?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};

export default DynamicFormField;

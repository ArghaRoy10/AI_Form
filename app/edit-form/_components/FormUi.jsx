import { Input } from '@/components/ui/input'
import { json } from 'drizzle-orm/mysql-core'
import React, { useRef, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import FieldEdit from './FieldEdit'
import { userResponses } from '@/configs/schema'
import { toast } from 'sonner'
import { db } from '@/configs'
import moment from 'moment/moment'

function FormUi({ jsonForm, selectedTheme, onFieldUpdate, deleteField, editable=true, formId=0 }) {
  const [formData, setFormData] = useState({});
  let formRef = useRef();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleCheckboxChange = (field_name, itemName, value) => {
    const list = formData?.[field_name] || [];
    if (value) {
      list.push({ label: itemName, value });
      setFormData({ ...formData, [field_name]: list });
    } else {
      const result = list.filter((item) => item.label !== itemName);
      setFormData({ ...formData, [field_name]: result });
    }
  }

  const onFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);

    const result = await db.insert(userResponses)
      .values({
        jsonResponse: formData,
        createdDate: moment().format('DD-MM-YYYY'),
        formRef: formId
      });

    if (result) {
      formRef.current.reset();
      toast('Form submitted successfully');
    } else {
      toast('Failed to submit form');
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={onFormSubmit}
      className='border p-5 md:w-[600px] rounded-lg' data-theme={selectedTheme}
    >
      <h2 className='font-bold text-center text-2xl'>{jsonForm?.form_title}</h2>
      <h2 className='text-sm text-gray-400 text-center'>{jsonForm?.form_subheading}</h2>

      {jsonForm?.fields?.map((field, index) => (
        <div key={index} className='flex items-center gap-2'>
          {field.field_type === 'dropdown' || field.field_type === 'select' ? (
            <div className='my-3 w-full'>
              <label className='text-xs text-gray-500'>{field.label}</label>
              <Select required={field?.required} onValueChange={(v) => handleSelectChange(field.field_name, v)}>
                <SelectTrigger className="w-full bg-transparent">
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((item, index) => (
                    <SelectItem key={index} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : field.field_type === 'radio' ? (
            <div className='w-full my-3'>
              <label className='text-xs text-gray-500'>{field.label}</label>
              <RadioGroup required={field?.required}>
                {field.options.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={item} id={`radio-${index}`} onClick={() => handleSelectChange(field.field_name, item)} />
                    <Label htmlFor={`radio-${index}`}>{item}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : field.field_type === 'checkbox' && field.options ? (
            <div className='my-3 w-full'>
              <label className='text-xs text-gray-500'>{field.label}</label>
              {field.options.map((item, index) => (
                <div key={index} className='flex gap-2 items-center'>
                  <Checkbox onCheckedChange={(v) => handleCheckboxChange(field?.label, item, v)} id={`checkbox-${index}`} name={item} />
                  <label htmlFor={`checkbox-${index}`} className='text-sm ml-2'>
                    {item}
                  </label>
                </div>
              ))}
            </div>
          ) : field.field_type === 'checkbox' ? (
            <div className='w-full my-3 flex items-center'>
              <Checkbox required={field?.required} id={`checkbox-${index}`} name={field.field_name} />
              <label htmlFor={`checkbox-${index}`} className='text-sm ml-2'>
                {field.label}
              </label>
            </div>
          ) : (
            <div className='my-3 w-full'>
              <label className='text-xs text-gray-500'>{field.label}</label>
              <Input type={field?.type} placeholder={field.placeholder} name={field.field_name}
                required={field?.required}
                onChange={(event) => handleInputChange(event)}
              />
            </div>
          )}

          {editable && (
            <div>
              <FieldEdit defaultValue={field}
                onUpdate={(value) => onFieldUpdate(value, index)}
                deleteField={() => deleteField(index)}
              />
            </div>
          )}
        </div>
      ))}
      <button type='submit' className='btn btn-primary'>Submit</button>
    </form>
  );
}

export default FormUi;

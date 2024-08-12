'use client';

import { db } from '@/configs';
import { JsonForms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { and, eq } from 'drizzle-orm';
import { ArrowLeft, Share2, SquareArrowOutUpRight, SquareArrowUpRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import FormUi from '../_components/FormUi';
import { fromJSON } from 'postcss';
import { toast } from 'sonner';
import Controller from '../_components/Controller';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RWebShare } from 'react-web-share';

function EditForm({ params }) {
    const { user } = useUser();
    const router = useRouter();
    const [jsonForm, setJsonForm] = useState(null); // Initialize state for jsonForm

    const [updateTrigger, setUpdateTrigger] = useState();
    const [record,setRecord] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState('light');
    const [selectedBackground,setSelectedBackground] = useState();

    useEffect(() => {
        if (user) {
            GetFormData();
        }
    }, [user]);

    const GetFormData = async () => {
        try {
            const result = await db.select().from(JsonForms)
                .where(and(eq(JsonForms.id, params?.formId), eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)));
            
            if (result.length > 0) {
                const parsedJson = JSON.parse(result[0].jsonform); // Parsing the JSON string
                console.log("Parsed JSON:", parsedJson); // Logging the parsed JSON to the console
                setRecord(result[0]);
                setJsonForm(parsedJson); // Set the parsed JSON to the state
                setSelectedBackground(result[0].background);
                setSelectedTheme(result[0].theme);
            } else {
                console.log("No form data found for the given ID.");
            }
        } catch (error) {
            console.error("Error retrieving or parsing JSON:", error);
        }
    };

    useEffect(() => {
      if(updateTrigger){
        setJsonForm(jsonForm);
        updateJsonFormInDb();
      }
      setJsonForm(jsonForm);
    },[updateTrigger]);
    const onFieldUpdate = (value,index) => {
      jsonForm.fields[index].label = value.label;
      jsonForm.fields[index].placeholder = value.placeholder;
      setUpdateTrigger(Date.now());
    }

    const updateJsonFormInDb=async()=>{
      const result = await db.update(JsonForms)
      .set({
        jsonform:jsonForm
      }).where(and(eq(JsonForms.id,record.id),
      eq(JsonForms.createdBy,user?.primaryEmailAddress?.emailAddress)));
      toast("Form updated successfully");
      console.log(result);
    }

    const deleteField = (indexToRemove) => {
      const result = jsonForm.fields.filter((item, index) => index != indexToRemove);
      jsonForm.fields = result;
      setUpdateTrigger(Date.now());
    }

    const updateControllerFields= async(value,columnName)=>{
      const result = await db.update(JsonForms).set({
        [columnName]:value
      }).where(and(eq(JsonForms.id,record.id),
      eq(JsonForms.createdBy,user?.primaryEmailAddress?.emailAddress)));
      toast("Theme updated");
    }

    return (
      <div className='p-10'>
        <div className='flex justify-between items-center'>
        <h2 className='flex gap-2 items-center my-5 cursor-pointer hover:font-bold' onClick={() => router.back()}>
          <ArrowLeft/>Back
        </h2>
        <div className='flex gap-2'>
          <Link href={'/aiform/'+ record?.id} target='_blank'>
          <Button className="flex gap-2 bg-red-600 hover:bg-red-600"><SquareArrowOutUpRight className='h-5 w-5'/> Live Preview</Button></Link>
          <RWebShare
        data={{
          text:jsonForm?.form_subheading+" , Build your own form with the help of AI Form Builder" ,
          url: process.env.NEXT_PUBLIC_BASE_URL+"/aiform/"+record?.id,
          title: jsonForm?.form_title,
        }}
        onClick={() => console.log("shared successfully!")}
      >
       <Button className="flex gap-2 bg-blue-500 hover:bg-blue-500"><Share2/> Share</Button>
      </RWebShare>
        </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          <div className='p-5 border rounded-lg shadow-md'>
            <Controller selectedTheme={(value) => {
                updateControllerFields(value,'theme')
                setSelectedTheme(value)
            }}
              selectedBackground={(value)=>{
                updateControllerFields(value,'background')
                setSelectedBackground(value)
              }}
              />
          </div>
          <div className='md:col-span-2 border rounded-lg p-4 flex items-center justify-center'
          style={{
            backgroundImage:selectedBackground
          }}
          >
            {/* Pass jsonForm to FormUi only if it's loaded */}
            {jsonForm ? <FormUi jsonForm={jsonForm} selectedTheme={selectedTheme} onFieldUpdate={onFieldUpdate} deleteField={(index)=>deleteField(index)} /> : <p>Loading form data...</p>}
          </div>
        </div>
      </div>
    );
}

export default EditForm;

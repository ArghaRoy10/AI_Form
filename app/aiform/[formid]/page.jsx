"use client";

import FormUi from '@/app/edit-form/_components/FormUi';
import { db } from '@/configs';
import { JsonForms } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'

function LiveAiForm({params}) {



    const [record,setRecord] = useState();
    const [jsonForm,setJsonForm] = useState([]);
    useEffect(()=>{
        params&&GetFormData()
    },[params])

    const GetFormData = async ()=>{
        const result = await db.select().from(JsonForms)
        .where(eq(JsonForms.id,Number(params?.formid)));


        setRecord(result[0]);
        setJsonForm(JSON.parse(result[0].jsonform));
        console.log(result);
    }
  return (
    <div className='p-10 flex justify-center items-center'
    style={{
        backgroundImage:record?.background
    }}
    
    >
        <FormUi
        jsonForm={jsonForm}
        onFieldUpdate={()=>console.log}
        deleteField={()=>console.log}
        selectedStyle={record?.style}
        selectedTheme={record?.theme}
        editable={false}
        formId={record?.id}
        />
    </div>
  )
}

export default LiveAiForm
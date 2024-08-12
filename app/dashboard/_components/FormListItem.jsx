import { Button } from '@/components/ui/button'
import { Edit2, Share2, Trash } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs'
import { JsonForms } from '@/configs/schema'
import { and, eq } from 'drizzle-orm'
import { toast } from 'sonner'
import { RWebShare } from 'react-web-share'
  
function FormListItem({formRecord,jsonForm,refreshData}) {

    const {user}= useUser();
    const onDeleteForm = async ()=>{
        const result = await db.delete(JsonForms)
        .where(and(eq(JsonForms.id,formRecord.id),eq(JsonForms.createdBy,user?.primaryEmailAddress?.emailAddress)))

        if(result){
            toast("Form Deleted Successfully");
            refreshData();
        }
    }

  return (
    <div className='border shadow-sm rounded-lg p-4'>
        <div className='flex justify-between'>
            <h2></h2>
             <AlertDialog asChild>
  <AlertDialogTrigger>
  <Trash className='h-5 w-5 text-red-500 cursor-pointer'
  />
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
       onClick={()=>onDeleteForm()}
      >Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

        </div>
        <h2 className='text-lg text-black'>{jsonForm?.form_title}</h2>
        <h2 className='text-sm text-gray-500'>{jsonForm?.form_subheading}</h2>
        <hr className='my-4'></hr>
        <div className='flex justify-between'>
        <RWebShare
        data={{
          text:jsonForm?.form_subheading+" , Build your own form with the help of AI Form Builder" ,
          url: process.env.NEXT_PUBLIC_BASE_URL+"/aiform/"+formRecord?.id,
          title: jsonForm?.form_title,
        }}
        onClick={() => console.log("shared successfully!")}
      >
       <Button variant="outline" size="sm" className="flex gap-2">
       <Share2 className='h-5 w-5'/>Share</Button>
      </RWebShare>
            <Link href={'/edit-form/'+formRecord?.id}>
            <Button className="flex gap-2 bg-blue-500" size="sm"><Edit2 className='h-5 w-5'/> Edit</Button>
            </Link>
        </div>
    </div>
  )
}

export default FormListItem
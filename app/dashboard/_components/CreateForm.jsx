"use client";
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea';
import { AiChatSession } from '@/configs/AiModal';
import { useUser } from '@clerk/nextjs';
import { db } from '@/configs';
import { JsonForms } from '@/configs/schema';
import moment from 'moment/moment';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';


const Prompt = "Based on this user's description (UserInput), generate a form in JSON format. The form should include a form_title and form_subheading. For each field, include the following properties: field_name, placeholder, label, field_type, and required. Ensure the response contains only the JSON object, starting with `{` and ending with `}`. Do not include any other text, markdown formatting, or backticks."
function CreateForm() {
    const  [openDialog, setOpenDialog] = useState(false);
    const [userInput,setUserInput] = useState();
    const [loading, setLoading] = useState();
    const {user} = useUser();
    const route = useRouter();
    const onCreateForm = async () => {
        setLoading(true);
        const result = await AiChatSession.sendMessage("Description: "+userInput+Prompt);
        console.log(result.response.text());
        if(result.response.text())
        { 
            const resp = await db.insert(JsonForms)
            .values({
                jsonform:result.response.text(),
                createdBy:user?.primaryEmailAddress?.emailAddress,
                createdDate:moment().format('DD-MM-YYYY')
            }).returning({id:JsonForms.id});
            console.log("New Form Id",resp[0].id);
            if(resp[0].id){
                route.push('/edit-form/'+resp[0].id); 
            }
            setLoading(false);
        }
        setLoading(false);
    }
    return (
        <div>
            <Button onClick={()=>setOpenDialog(true)}>+ Create AI Form</Button>
            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create new form</DialogTitle>
                        <DialogDescription>
                        <Textarea className="my-2"
                            onChange={(e)=>setUserInput(e.target.value)}
                        placeholder="Write description of your form"/>
                        <div className='flex gap-2 my-3 justify-end'>
                            <Button 
                            onClick={()=>setOpenDialog(false)}
                            variant ="destructive">Cancel</Button>
                            <Button 
                            disabled={loading}
                            onClick={()=>onCreateForm()}>
                                {loading?
                                    <Loader2 className='animate-spin'/>:'Create'
                                }
                                </Button>
                        </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default CreateForm
'use client'
import React from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
} from "@/components/ui/alert-dialog";
import { useToast } from './ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Message } from '@/models/User';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
   message: Message,
   onDeleteMessage: (messageId: any) => void 
}

function MessageCard({message, onDeleteMessage} : MessageCardProps) {
   const {toast} = useToast()
   const handleDeleteConfirm = async() => {
      try {
         const response = await axios.delete(`/api/delete-message/${message._id}`)
         toast({
           title: response.data.message,
         });
         onDeleteMessage(message._id);
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         toast({
           title: "Error",
           description:
             axiosError.response?.data.message ?? "Failed to delete message",
           variant: "destructive",
         });
      }
   }
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default MessageCard
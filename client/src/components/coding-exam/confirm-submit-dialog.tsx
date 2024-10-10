import React from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

interface ConfirmSubmitDialogProps {
    children: React.ReactNode
    onConfirm: () => void
    timeLeft: string
}

export default function ConfirmSubmitDialog({ children, onConfirm, timeLeft }: ConfirmSubmitDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold">End Your Test?</AlertDialogTitle>
                    <AlertDialogDescription className="text-lg">
                        Are you sure you want to submit your test now?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex items-center justify-center py-4">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 text-yellow-600">
                        <Clock className="w-10 h-10" />
                    </div>
                </div>
                <p className="text-center text-lg font-medium">
                    You still have <span className="text-yellow-600 font-bold">{timeLeft} minutes</span> remaining.
                </p>
                <p className="text-center text-muted-foreground mt-2">
                    If you'd like to review your answers, click "Cancel" to go back.
                </p>
                <AlertDialogFooter className="sm:justify-center gap-4 mt-6">
                    <AlertDialogCancel asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                            Cancel
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button onClick={onConfirm} className="w-full sm:w-auto">
                            Submit Test
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
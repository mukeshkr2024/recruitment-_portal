import { Copy } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
    link: string;
    title?: string;
}

export const ShareLink = ({ link, title }: Props) => {
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(link)
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);  // Reset success message after 2 seconds
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Share</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                        Anyone with this link will be able to register as a {title}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={link}
                            readOnly
                        />
                    </div>
                    <Button onClick={handleCopy} size="sm" className="px-3">
                        <span className="sr-only">Copy</span>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                {copySuccess && <p className="text-sm text-green-500">Link copied!</p>}
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

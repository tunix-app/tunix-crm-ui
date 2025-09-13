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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import React from "react"

export function NewSession() {
    return (
        <Dialog>
                <DialogTrigger asChild>
                    <Button 
                        variant="blue" 
                        size="sm" 
                        className="flex items-center rounded-full"
                        style={{ borderRadius: '9999px' }}
                    >
                        <Plus size={16} className="mr-1" />
                        New Session
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <form>
                        <DialogHeader>
                            <DialogTitle>Schedule New Session</DialogTitle>
                            <DialogDescription>
                                Schedule a new session
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-3">
                            <div className="grid gap-3">
                                <Label htmlFor="clientName-1">Client Name</Label>
                                <Input style={{ borderRadius: '24px' }} id="clientName-1" name="clientName" defaultValue="@peduarte" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="clientEmail-1">Client Email</Label>
                                <Input style={{ borderRadius: '24px' }} id="clientEmail-1" name="clientEmail" defaultValue="@peduarte" />
                            </div>
                            <div className="grid gap-3">
                                <Select>
                                <SelectTrigger className="w-[180px]" style={{ borderRadius: '24px'}}>
                                    <SelectValue placeholder="Select session type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectItem value="apple">Strength Training</SelectItem>
                                    <SelectItem value="banana">Mobility Work</SelectItem>
                                    <SelectItem value="blueberry">Rehabilitation</SelectItem>
                                    <SelectItem value="grapes">Assessment</SelectItem>
                                    <SelectItem value="pineapple">Stretching</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <DialogClose asChild>
                                <Button variant="outline" className="mr-2 bg-red-100 hover:bg-red-100" style={{ borderRadius: '24px' }}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit" className="mr-2 bg-green-100" variant="outline" style={{ borderRadius: '24px' }}>Create Session</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
        </Dialog>
    )
}

export default NewSession;
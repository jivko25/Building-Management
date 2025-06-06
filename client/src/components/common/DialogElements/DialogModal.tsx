//client\src\components\common\DialogElements\DialogModal.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Edit, Plus } from "lucide-react";

type DialogModalProps<T> = {
  Component: React.ComponentType<T>;
  CreateButtonModal?: React.ReactNode;
  props: T;
  createButtonTitle?: string;
  title: string;
  className?: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  icon?: React.ReactNode;
  maxWidth?: string;
};

const DialogModal = <T extends {}>({ Component, props, createButtonTitle, title, className, isOpen, maxWidth, setIsOpen, CreateButtonModal, icon = <Edit /> }: DialogModalProps<T>) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {CreateButtonModal ? (
          <Button className={cn("w-full lg:max-w-[12rem]", className)}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="font-bold">{createButtonTitle}</span>
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            {icon}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent style={{ maxWidth: `${maxWidth}` }} className="max-w-[22rem] sm:max-w-[30rem] rounded-md ">
        <DialogHeader>
          <DialogTitle className={cn("text-center font-semibold text-lg", className)}>{title}</DialogTitle>
        </DialogHeader>
        <Component {...props} />
      </DialogContent>
    </Dialog>
  );
};

export default DialogModal;

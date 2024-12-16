//client\src\hooks\useToastHook.ts
import { useToast } from "@/components/ui/use-toast";

type ToastProps = {
  title: string;
  variant: "default" | "destructive" | "success" | null | undefined;
};

const useToastHook = () => {
  const { toast } = useToast();

  const fireToast = ({ title, variant }: ToastProps) => {
    toast({
      variant: variant,
      title: title,
      duration: 3000
    });
  };

  const fireSuccessToast = (title: string) => {
    fireToast({
      title,
      variant: "success"
    });
  };

  const fireErrorToast = (title: string) => {
    fireToast({
      title,
      variant: "destructive"
    });
  };

  return {
    fireToast,
    fireSuccessToast,
    fireErrorToast
  };
};

export default useToastHook;

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState } from "react";

interface FormEmailListProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
}

const FormEmailList = ({ control, name, label, placeholder }: FormEmailListProps) => {
  const [newEmail, setNewEmail] = useState("");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const emails = field.value || [];
        console.log("📧 Current emails:", emails);

        const handleAddEmail = () => {
          if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
            const updatedEmails = [...emails, newEmail];
            field.onChange(updatedEmails);
            setNewEmail("");
            console.log("✉️ Email added:", newEmail);
            console.log("📧 Updated emails:", updatedEmails);
          }
        };

        const handleRemoveEmail = (index: number) => {
          const updatedEmails = emails.filter((_: string, i: number) => i !== index);
          field.onChange(updatedEmails);
          console.log("❌ Email removed at index:", index);
          console.log("📧 Updated emails:", updatedEmails);
        };

        const handleKeyPress = (e: React.KeyboardEvent) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddEmail();
          }
        };

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input placeholder={placeholder} value={newEmail} onChange={e => setNewEmail(e.target.value)} onKeyPress={handleKeyPress} />
                  <Button type="button" onClick={handleAddEmail} disabled={!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(emails) &&
                    emails.map((email: string, index: number) => (
                      <div key={index} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                        <span>{email}</span>
                        <button type="button" onClick={() => handleRemoveEmail(index)} className="text-secondary-foreground hover:text-destructive">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormEmailList;

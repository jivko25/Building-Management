import { useLanguage } from "@/context/LanguageContext";
import { SUPPORTED_LANGUAGES } from "@/types/language.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import register_image from "@/assets/login_image.jpg";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { appLanguage, setAppLanguage } = useLanguage();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="bg-slate-950 flex flex-col justify-center px-8 py-12 lg:px-16">
        {/* Language Selector */}
        <div className="absolute top-4 right-4 w-[200px] z-[1000] language-select-container">
          <Select value={appLanguage} onValueChange={value => setAppLanguage(value as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden lg:block relative">
        <img 
          src={register_image} 
          alt="Auth" 
          className="absolute inset-0 w-full h-full object-cover dark:brightness-[0.3]" 
        />
      </div>
    </div>
  );
};

export default AuthLayout; 
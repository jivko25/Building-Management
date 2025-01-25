import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  const navigate = useNavigate();
  console.log("Rendering 404 page");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-2xl text-muted-foreground mb-8">Page Not Found</p>
      <Button onClick={() => navigate("/")} className="px-6 py-2">
        Go Home
      </Button>
    </div>
  );
};

export default NotFoundPage;

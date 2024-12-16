//client\src\utils\LoadingSpinner\LoadingSpinner.tsx
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

interface LoadingSpinnerProps {
  message?: string;
  duration?: number;
}

const BouncingBallLoader = ({ delay }: { delay: number }) => {
  return <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }}></div>;
};

const LoadingSpinner = ({ message = "Loading...", duration = 3000 }: LoadingSpinnerProps = {}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 1;
        return Math.min(oldProgress + diff, 100);
      });
    }, duration / 100);

    return () => {
      clearInterval(timer);
    };
  }, [duration]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#020817] bg-opacity-80 backdrop-blur-sm">
      <div className="flex space-x-2 mb-2">
        <BouncingBallLoader delay={0} />
        <BouncingBallLoader delay={100} />
        <BouncingBallLoader delay={150} />
      </div>
      <p className="mt-4 text-lg font-semibold text-primary">{message}</p>
      <div className="mt-4 w-64">
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};

export default LoadingSpinner;

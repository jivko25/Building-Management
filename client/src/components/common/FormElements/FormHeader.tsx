//client\src\components\common\FormElements\FormHeader.tsx
type FormHeaderProps = {
  title: string;
  description: string;
};

const FormHeader = ({ title, description }: FormHeaderProps) => {
  return (
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default FormHeader;

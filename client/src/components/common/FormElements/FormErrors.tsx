type FormErrorsProps = {
    error?: string;
}

const FormErrors = ({ error }: FormErrorsProps) => {
    return (
        <>
            {error && (
                <div className="text-red-500 font-semibold mt-4 text-center">
                    {error}
                </div>
            )}
        </>
    )
}

export default FormErrors
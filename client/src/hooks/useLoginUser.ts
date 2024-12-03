import { useAuth } from '@/context/AuthContext';
import { UserLoginFormData } from '@/types/user-types/userTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { loginDefaultValues, loginFormSchema } from '@/models/user/userSchema';

const useLoginUser = () => {
    const { user, login, isLoading, error } = useAuth();
    const [isLoginSuccess, setIsLoginSuccess] = useState<boolean>(false);
    const navigate = useNavigate();

    const form = useForm<UserLoginFormData>({
        resolver: zodResolver(loginFormSchema),
        mode: 'onChange',
        defaultValues: loginDefaultValues
    });

    const onSubmit: SubmitHandler<UserLoginFormData> = async (userData: UserLoginFormData) => {
        const isSuccess = await login(userData.username, userData.password);

        if (isSuccess) {
            setIsLoginSuccess(true);
            if (user?.role === 'manager') {
                navigate('/projects');
            } else if (user?.role === 'user') {
                navigate('/my-projects');
            }
        }
    };

    useEffect(() => {
        if (user && isLoginSuccess) {
            if (user.role === 'manager') {
                navigate('/projects');
            } else if (user.role === 'user') {
                navigate('/my-projects');
            }
        }
    }, [user, isLoginSuccess, navigate]);

    return {
        form,
        onSubmit,
        isLoading,
        error
    }
}

export default useLoginUser;
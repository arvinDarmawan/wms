'use client';

import Button from '@/components/action/Button';
import Input from '@/components/input/InputField';
import Label from '@/components/input/Label';
import { useAuth } from '@/context/AuthContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface LoginForm {
    email: string;
    password: string;
}

export default function LoginForm() {
    const router = useRouter();
    const { setUser } = useAuth();

    const schema = Yup.object().shape({
        email: Yup.string().required('Email is required'),
        password: Yup.string().required('Password is required')
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: ''
        },
        mode: 'onSubmit'
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            const res = await fetch('/api/signIn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to login');

            const resData = await res.json();
            setUser(resData);

            router.push('/order');
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen px-4 sm:px-6">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md text-center">
                            Sign In
                        </h1>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        Email{' '}
                                        <span className="text-error-500">
                                            *
                                        </span>{' '}
                                    </Label>
                                    <Input
                                        placeholder="info@gmail.com"
                                        {...register('email')}
                                        type="email"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label>
                                        Password{' '}
                                        <span className="text-error-500">
                                            *
                                        </span>{' '}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={'password'}
                                            {...register('password')}
                                            placeholder="Enter your password"
                                        />
                                        {errors.password && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.password.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="sm">
                                        Sign in
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import Button from '@/components/action/Button';
import DeleteConfirmationModal from '@/components/action/DeleteConfirmationModal';
import { Modal } from '@/components/action/Modal';
import Card from '@/components/display/Card';
import Table from '@/components/display/Table';
import Input from '@/components/input/InputField';
import Label from '@/components/input/Label';
import { useModal } from '@/hooks/useModal';
import { yupResolver } from '@hookform/resolvers/yup';
import { PlusIcon } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface User {
    id: number;
    fullName: string;
    email: string;
}

type UserForm = Omit<User, 'id'> & { id?: number };

export default function UserPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search] = useState('');

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const isEditing = !!selectedUser;

    const { isOpen, openModal, closeModal } = useModal();
    const {
        isOpen: isDeleteOpen,
        openModal: openDeleteModal,
        closeModal: closeDeleteModal
    } = useModal();

    const columns: { key: keyof User; label: string }[] = [
        { key: 'id', label: 'ID' },
        { key: 'fullName', label: 'Name' },
        { key: 'email', label: 'Email' }
    ];

    const schema = Yup.object().shape({
        fullName: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required')
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UserForm>({
        resolver: yupResolver(schema),
        defaultValues: { fullName: '', email: '' },
        mode: 'onSubmit'
    });

    // Fetch users
    const fetchUsers = useCallback(
        async (pageNumber = 1, searchQuery = '') => {
            try {
                const res = await fetch(
                    `http://localhost:3001/api/users?page=${pageNumber}&limit=${limit}&search=${searchQuery}`
                );
                if (!res.ok) throw new Error('Failed to fetch users');

                const response = await res.json();
                setUsers(response.data);
                setTotal(response.total || 0);
                setPage(response.page || 1);
            } catch (err) {
                console.error(err);
                alert('Error fetching users');
            }
        },
        [limit]
    );

    useEffect(() => {
        fetchUsers(page, search);
    }, [fetchUsers, page, search]);

    useEffect(() => {
        if (isOpen) {
            reset(selectedUser ?? { fullName: '', email: '' });
        }
    }, [isOpen, selectedUser, reset]);

    const handleAdd = () => {
        setSelectedUser(null);
        openModal();
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        openModal();
    };

    const handleDelete = (user: User) => {
        setUserToDelete(user);
        openDeleteModal();
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            const res = await fetch(
                `http://localhost:3001/api/users/${userToDelete.id}`,
                { method: 'DELETE' }
            );
            if (!res.ok) throw new Error('Failed to delete user');
            await res.json();
            fetchUsers(page, search);
        } catch (err) {
            console.error(err);
            alert('Error deleting user');
        } finally {
            closeDeleteModal();
            setUserToDelete(null);
        }
    };

    const onSubmit = async (data: UserForm) => {
        if (isEditing && selectedUser) {
            try {
                const res = await fetch(
                    `http://localhost:3001/api/users/${selectedUser.id}`,
                    {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    }
                );
                if (!res.ok) throw new Error('Failed to update user');
                await res.json();
            } catch (err) {
                console.error(err);
                alert('Error updating user');
            }
        } else {
            try {
                const res = await fetch('http://localhost:3001/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!res.ok) throw new Error('Failed to create user');

                await res.json();
            } catch (err) {
                console.error(err);
                alert('Error creating user');
            }
        }

        closeModal();
        fetchUsers(page, search);
    };

    return (
        <Card title="Users">
            <div className="space-y-6">
                <Button size="sm" startIcon={<PlusIcon />} onClick={handleAdd}>
                    Add
                </Button>
                <Table
                    data={users}
                    columns={columns}
                    total={total}
                    rowsPerPage={limit}
                    renderActions={(user) => (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(user)}
                                className="px-2 py-1 bg-blue-500 text-white rounded">
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(user)}
                                className="px-2 py-1 bg-red-500 text-white rounded">
                                Delete
                            </button>
                        </div>
                    )}
                />
            </div>

            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                className="max-w-[584px] p-5 lg:p-10">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h4 className="mb-6 text-lg font-medium text-gray-800">
                        {isEditing ? 'Edit User' : 'Add User'}
                    </h4>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                        <div>
                            <Label>Full name</Label>
                            <Input
                                type="text"
                                {...register('fullName')}
                                placeholder="Full name"
                                error={!!errors.fullName}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                {...register('email')}
                                placeholder="Email"
                                error={!!errors.email}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-end w-full gap-3 mt-6">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={closeModal}>
                            Close
                        </Button>
                        <Button size="sm" type="submit">
                            Save
                        </Button>
                    </div>
                </form>
            </Modal>

            <DeleteConfirmationModal
                isOpen={isDeleteOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
            />
        </Card>
    );
}

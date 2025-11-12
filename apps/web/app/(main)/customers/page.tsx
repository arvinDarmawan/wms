'use client';

import Button from '@/components/action/Button';
import DeleteConfirmationModal from '@/components/action/DeleteConfirmationModal';
import { Modal } from '@/components/action/Modal';
import Card from '@/components/display/Card';
import Table from '@/components/display/Table';
import Input from '@/components/input/InputField';
import Label from '@/components/input/Label';
import TextArea from '@/components/input/Textarea';
import { useModal } from '@/hooks/useModal';
import { yupResolver } from '@hookform/resolvers/yup';
import { PlusIcon } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

//await import('yup-phone');

interface Customer {
    id: number;
    code: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    shippingAddress: string;
    billingAddress: string;
}

type CustomerForm = Omit<Customer, 'id' | 'code'> & { id?: number };

export default function CustomerPage() {
    const [data, setData] = useState<Customer[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search] = useState('');

    const [selectedItem, setSelectedItem] = useState<Customer | null>(null);
    const [itemToDelete, setItemToDelete] = useState<Customer | null>(null);
    const isEditing = !!selectedItem;

    const { isOpen, openModal, closeModal } = useModal();
    const {
        isOpen: isDeleteOpen,
        openModal: openDeleteModal,
        closeModal: closeDeleteModal
    } = useModal();

    const columns: { key: keyof Customer; label: string }[] = [
        { key: 'id', label: 'ID' },
        { key: 'code', label: 'Code' },
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'phoneNumber', label: 'Phone Number' },
        { key: 'shippingAddress', label: 'Shipping Address' },
        { key: 'billingAddress', label: 'Billing Address' }
    ];

    const schema = Yup.object().shape({
        firstName: Yup.string()
            .required('First name is required')
            .max(30, 'First Name must be at most 30 characters'),
        lastName: Yup.string()
            .required('Last name is required')
            .max(30, 'Last Name must be at most 30 characters'),
        email: Yup.string()
            .email('Invalid email')
            .required('Email is required'),
        phoneNumber: Yup.string()
            .matches(
                /^(?:\+62|08)[1-9][0-9]{6,11}$/,
                'Phone number must start with +62 or 08 and be valid'
            )
            .max(15, 'Last Name must be at most 15 characters')
            .required('Phone number is required'),
        shippingAddress: Yup.string().required('Address is required'),
        billingAddress: Yup.string().required('Address is required')
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CustomerForm>({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            shippingAddress: '',
            billingAddress: ''
        },
        mode: 'onSubmit'
    });

    const fetchData = useCallback(
        async (pageNumber = 1, searchQuery = '') => {
            try {
                const res = await fetch(
                    `http://localhost:3001/api/customers?page=${pageNumber}&limit=${limit}&search=${searchQuery}`
                );
                if (!res.ok) throw new Error('Failed to fetch customers');

                const response = await res.json();
                setData(response.data);
                setTotal(response.total || 0);
                setPage(response.page || 1);
            } catch (err) {
                console.error(err);
                alert('Error fetching customers');
            }
        },
        [limit]
    );

    useEffect(() => {
        fetchData(page, search);
    }, [fetchData, page, search]);

    useEffect(() => {
        if (isOpen) {
            reset(
                selectedItem ?? {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: '',
                    shippingAddress: '',
                    billingAddress: ''
                }
            );
        }
    }, [isOpen, selectedItem, reset]);

    const handleAdd = () => {
        setSelectedItem(null);
        openModal();
    };

    const handleEdit = (customer: Customer) => {
        setSelectedItem(customer);
        openModal();
    };

    const handleDelete = (customer: Customer) => {
        setItemToDelete(customer);
        openDeleteModal();
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const res = await fetch(
                `http://localhost:3001/api/customers/${itemToDelete.id}`,
                { method: 'DELETE' }
            );
            if (!res.ok) throw new Error('Failed to delete customer');

            await res.json();
            fetchData(page, search);
        } catch (err) {
            console.error(err);
            alert('Error deleting customer');
        } finally {
            closeDeleteModal();
            setItemToDelete(null);
        }
    };

    const onSubmit = async (data: CustomerForm) => {
        if (isEditing && selectedItem) {
            try {
                const res = await fetch(
                    `http://localhost:3001/api/customers/${selectedItem.id}`,
                    {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    }
                );
                if (!res.ok) throw new Error('Failed to update customer');
                await res.json();
            } catch (err) {
                console.error(err);
                alert('Error updating customer');
            }
        } else {
            try {
                const res = await fetch('http://localhost:3001/api/customers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!res.ok) throw new Error('Failed to create customer');

                await res.json();
            } catch (err) {
                console.error(err);
                alert('Error creating customer');
            }
        }

        closeModal();
        fetchData(page, search);
    };

    return (
        <Card title="Cutomers">
            <div className="space-y-6">
                <Button size="sm" startIcon={<PlusIcon />} onClick={handleAdd}>
                    Add
                </Button>
                <Table
                    data={data}
                    columns={columns}
                    total={total}
                    rowsPerPage={limit}
                    renderActions={(customer) => (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(customer)}
                                className="px-2 py-1 bg-blue-500 text-white rounded">
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(customer)}
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
                    <h4 className="mb-6 text-lg font-medium text-gray-800 text-white/90">
                        {isEditing ? 'Edit Customer' : 'Add Customer'}
                    </h4>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <Label>First Name</Label>
                            <Input
                                type="text"
                                {...register('firstName')}
                                placeholder="Name"
                                error={!!errors.firstName}
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>
                        <div className="sm:col-span-1">
                            <Label>Last Name</Label>
                            <Input
                                type="text"
                                {...register('lastName')}
                                placeholder="Name"
                                error={!!errors.lastName}
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.lastName.message}
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
                        <div>
                            <Label>Phone Number</Label>
                            <Input
                                type="phoneNumber"
                                {...register('phoneNumber')}
                                placeholder="+6281280633660"
                                error={!!errors.phoneNumber}
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.phoneNumber.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>Shipping Address</Label>
                            <TextArea
                                {...register('shippingAddress')}
                                placeholder="Shipping address"
                                error={!!errors.shippingAddress}
                            />
                            {errors.shippingAddress && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.shippingAddress.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>Billing Address</Label>
                            <TextArea
                                {...register('billingAddress')}
                                placeholder="Billing address"
                                error={!!errors.billingAddress}
                            />
                            {errors.billingAddress && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.billingAddress.message}
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

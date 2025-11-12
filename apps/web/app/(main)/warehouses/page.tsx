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

interface Warehouse {
    id: number;
    code: string;
    name: string;
    address: string;
}

type WarehouseForm = Omit<Warehouse, 'id' | 'code'> & { id?: number };

export default function WarehousePage() {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search] = useState('');

    const [selectedWarehouse, setSelectedWarehouse] =
        useState<Warehouse | null>(null);
    const [warehouseToDelete, setWarehouseToDelete] =
        useState<Warehouse | null>(null);
    const isEditing = !!selectedWarehouse;

    const { isOpen, openModal, closeModal } = useModal();
    const {
        isOpen: isDeleteOpen,
        openModal: openDeleteModal,
        closeModal: closeDeleteModal
    } = useModal();

    const columns: { key: keyof Warehouse; label: string }[] = [
        { key: 'id', label: 'ID' },
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'address', label: 'Address' }
    ];

    const schema = Yup.object().shape({
        name: Yup.string()
            .required('Name is required')
            .max(30, 'Name must be at most 30 characters'),
        address: Yup.string().required('Address is required')
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<WarehouseForm>({
        resolver: yupResolver(schema),
        defaultValues: { name: '', address: '' },
        mode: 'onSubmit'
    });

    // Fetch warehouses
    const fetchWarehouses = useCallback(
        async (pageNumber = 1, searchQuery = '') => {
            try {
                const res = await fetch(
                    `http://localhost:3001/api/warehouses?page=${pageNumber}&limit=${limit}&search=${searchQuery}`
                );
                if (!res.ok) throw new Error('Failed to fetch warehouses');

                const response = await res.json();
                setWarehouses(response.data);
                setTotal(response.total || 0);
                setPage(response.page || 1);
            } catch (err) {
                console.error(err);
                alert('Error fetching warehouses');
            }
        },
        [limit]
    );

    useEffect(() => {
        fetchWarehouses(page, search);
    }, [fetchWarehouses, page, search]);

    useEffect(() => {
        if (isOpen) {
            reset(selectedWarehouse ?? { name: '', address: '' });
        }
    }, [isOpen, selectedWarehouse, reset]);

    const handleAdd = () => {
        setSelectedWarehouse(null);
        openModal();
    };

    const handleEdit = (warehouse: Warehouse) => {
        setSelectedWarehouse(warehouse);
        openModal();
    };

    const handleDelete = (warehouse: Warehouse) => {
        setWarehouseToDelete(warehouse);
        openDeleteModal();
    };

    const confirmDelete = async () => {
        if (!warehouseToDelete) return;
        try {
            const res = await fetch(
                `http://localhost:3001/api/warehouses/${warehouseToDelete.id}`,
                { method: 'DELETE' }
            );
            if (!res.ok) throw new Error('Failed to delete warehouse');

            await res.json();
            fetchWarehouses(page, search);
        } catch (err) {
            console.error(err);
            alert('Error deleting warehouse');
        } finally {
            closeDeleteModal();
            setWarehouseToDelete(null);
        }
    };

    const onSubmit = async (data: WarehouseForm) => {
        if (isEditing && selectedWarehouse) {
            try {
                const res = await fetch(
                    `http://localhost:3001/api/warehouses/${selectedWarehouse.id}`,
                    {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    }
                );
                if (!res.ok) throw new Error('Failed to update warehouse');
                await res.json();
            } catch (err) {
                console.error(err);
                alert('Error updating warehouse');
            }
        } else {
            try {
                const res = await fetch(
                    'http://localhost:3001/api/warehouses',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    }
                );
                if (!res.ok) throw new Error('Failed to create warehouse');

                await res.json();
            } catch (err) {
                console.error(err);
                alert('Error creating warehouse');
            }
        }

        closeModal();
        fetchWarehouses(page, search);
    };

    return (
        <Card title="Warehouses">
            <div className="space-y-6">
                <Button size="sm" startIcon={<PlusIcon />} onClick={handleAdd}>
                    Add
                </Button>
                <Table
                    data={warehouses}
                    columns={columns}
                    total={total}
                    rowsPerPage={limit}
                    renderActions={(warehouse) => (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(warehouse)}
                                className="px-2 py-1 bg-blue-500 text-white rounded">
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(warehouse)}
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
                        {isEditing ? 'Edit Warehouse' : 'Add Warehouse'}
                    </h4>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                        <div>
                            <Label>Name</Label>
                            <Input
                                type="text"
                                {...register('name')}
                                placeholder="Name"
                                error={!!errors.name}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>Address</Label>
                            <TextArea
                                {...register('address')}
                                placeholder="Address"
                                error={!!errors.address}
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.address.message}
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

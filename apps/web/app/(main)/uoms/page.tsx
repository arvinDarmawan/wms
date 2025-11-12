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

interface Uom {
    id: number;
    code: string;
    name: string;
}

type UomForm = Omit<Uom, 'id'> & { id?: number };

export default function UomPage() {
    const [data, setData] = useState<Uom[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search] = useState('');

    const [selectedItem, setSelectedItem] = useState<Uom | null>(null);
    const [itemToDelete, setItemToDelete] = useState<Uom | null>(null);
    const isEditing = !!selectedItem;

    const { isOpen, openModal, closeModal } = useModal();
    const {
        isOpen: isDeleteOpen,
        openModal: openDeleteModal,
        closeModal: closeDeleteModal
    } = useModal();

    const columns: { key: keyof Uom; label: string }[] = [
        { key: 'id', label: 'ID' },
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' }
    ];

    const schema = Yup.object().shape({
        code: Yup.string()
            .required('Code is required')
            .max(8, 'Code must be at most 8 characters'),
        name: Yup.string()
            .required('Name is required')
            .max(15, 'Name must be at most 15 characters')
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UomForm>({
        resolver: yupResolver(schema),
        defaultValues: {
            code: '',
            name: ''
        },
        mode: 'onSubmit'
    });

    const fetchData = useCallback(
        async (pageNumber = 1, searchQuery = '') => {
            try {
                const res = await fetch(
                    `http://localhost:3001/api/uoms?page=${pageNumber}&limit=${limit}&search=${searchQuery}`
                );
                if (!res.ok) throw new Error('Failed to fetch uoms');

                const response = await res.json();
                setData(response.data);
                setTotal(response.total || 0);
                setPage(response.page || 1);
            } catch (err) {
                console.error(err);
                alert('Error fetching uoms');
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
                    code: '',
                    name: ''
                }
            );
        }
    }, [isOpen, selectedItem, reset]);

    const handleAdd = () => {
        setSelectedItem(null);
        openModal();
    };

    const handleEdit = (uom: Uom) => {
        setSelectedItem(uom);
        openModal();
    };

    const handleDelete = (uom: Uom) => {
        setItemToDelete(uom);
        openDeleteModal();
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const res = await fetch(
                `http://localhost:3001/api/uoms/${itemToDelete.id}`,
                { method: 'DELETE' }
            );
            if (!res.ok) throw new Error('Failed to delete uom');

            await res.json();
            fetchData(page, search);
        } catch (err) {
            console.error(err);
            alert('Error deleting uom');
        } finally {
            closeDeleteModal();
            setItemToDelete(null);
        }
    };

    const onSubmit = async (data: UomForm) => {
        if (isEditing && selectedItem) {
            try {
                const res = await fetch(
                    `http://localhost:3001/api/uoms/${selectedItem.id}`,
                    {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    }
                );
                if (!res.ok) throw new Error('Failed to update uom');
                await res.json();
            } catch (err) {
                console.error(err);
                alert('Error updating uom');
            }
        } else {
            try {
                const res = await fetch('http://localhost:3001/api/uoms', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!res.ok) throw new Error('Failed to create uom');

                await res.json();
            } catch (err) {
                console.error(err);
                alert('Error creating uom');
            }
        }

        closeModal();
        fetchData(page, search);
    };

    return (
        <Card title="Uoms">
            <div className="space-y-6">
                <Button size="sm" startIcon={<PlusIcon />} onClick={handleAdd}>
                    Add
                </Button>
                <Table
                    data={data}
                    columns={columns}
                    total={total}
                    rowsPerPage={limit}
                    renderActions={(uom) => (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(uom)}
                                className="px-2 py-1 bg-blue-500 text-white rounded">
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(uom)}
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
                    <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                        {isEditing ? 'Edit Uom' : 'Add Uom'}
                    </h4>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                        <div>
                            <Label>Code</Label>
                            <Input
                                type="text"
                                {...register('code')}
                                placeholder="Code"
                                error={!!errors.name}
                            />
                            {errors.code && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.code.message}
                                </p>
                            )}
                        </div>
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

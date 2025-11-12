'use client';

import Button from '@/components/action/Button';
import { Modal } from '@/components/action/Modal';
import React from 'react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-[400px] p-5 lg:p-10">
            <h4 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
                Confirm Delete
            </h4>
            <p>Are you sure you want to delete this data ?</p>
            <div className="flex justify-end gap-3 mt-6">
                <Button size="sm" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button size="sm" onClick={onConfirm}>
                    Delete
                </Button>
            </div>
        </Modal>
    );
};

export default DeleteConfirmationModal;

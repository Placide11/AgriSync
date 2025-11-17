import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import Modal from './Modal'; // We'll reuse our existing Modal component

const UpdateTaskStatusModal = ({ isOpen, onClose, task, onTaskUpdate }) => {
    // State to hold the selected status, initialized with the task's current status
    const [status, setStatus] = useState(task?.status || 'todo');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // When the modal opens with a new task, reset the status
    useEffect(() => {
        if (task) {
            setStatus(task.status);
            setError(null); // Clear previous errors
        }
    }, [task]);

    if (!task) {
        return null; // Don't render anything if there's no task
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Use the new backend endpoint: PATCH /api/tasks/update-status/<id>/
            // The PATCH method is used because we are only partially updating the resource
            await apiClient.patch(`/tasks/update-status/${task.id}/`, {
                status: status,
            });

            // Call the callback function passed from TasksPage to refresh the data
            onTaskUpdate();
            onClose(); // Close the modal on success
        } catch (err) {
            console.error("Failed to update task status:", err);
            setError(err.response?.data?.detail || "An error occurred while updating the status.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Update Task Status">
            <div className="space-y-4">
                {/* Display task details as read-only */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <p className="text-sm text-gray-500 mt-2">Due Date: {task.due_date}</p>
                </div>

                <hr />

                {/* Form to update the status */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Task Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 bg-white"
                            required
                        >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div className="flex justify-end space-x-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Status'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default UpdateTaskStatusModal;
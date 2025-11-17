import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/apiClient';
import Modal from '../components/Modal';
import SelectRelatedField from '../components/SelectRelatedField';
import UpdateTaskStatusModal from '../components/UpdateTaskStatusModal';
import { PlusCircleIcon, EditIcon, Trash2Icon, ArchiveIcon } from '../components/icons';

const TasksPage = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the main Add/Edit modal (for Admins)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null); // For editing
    
    // State for the worker's status update modal
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [taskForStatusUpdate, setTaskForStatusUpdate] = useState(null);

    // Form state
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    
    // Define the form fields for an Admin
    const adminTaskFormFields = [
        { name: 'title', label: 'Task Title', placeholder: 'e.g., Water the tomatoes', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Detailed instructions' },
        { 
            name: 'assigned_to_id', 
            label: 'Assign To', 
            type: 'select_related', 
            endpoint: '/auth/users/', 
            placeholder: 'Select User (Optional)', 
            optionValue: 'id', 
            optionLabel: 'username', 
        },
        { name: 'due_date', label: 'Due Date', type: 'date', required: true },
        { 
            name: 'status', 
            label: 'Status', 
            type: 'select', 
            required: true,
            options: [
                { value: 'todo', label: 'To Do' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'done', label: 'Done' },
            ],
        },
    ];

    const initialFormData = { title: '', description: '', due_date: '', status: 'todo', assigned_to_id: '' };

    // Fetch tasks data
    const fetchTasks = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        // If user is a worker, fetch only their tasks. Otherwise, fetch all.
        const endpoint = user.role === 'worker' ? `/tasks/tasks/?assigned_to=${user.id}` : '/tasks/tasks/';
        try {
            const response = await apiClient.get(endpoint);
            setTasks(response.data.results || response.data);
        } catch (err) {
            setError("Failed to fetch tasks.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Handlers for the main Admin modal
    const handleAdminEdit = (task) => {
        setCurrentTask(task);
        // Populate form data for editing
        const populatedData = {
            ...initialFormData,
            ...task,
            assigned_to_id: task.assigned_to?.id || null,
        };
        setFormData(populatedData);
        setIsEditModalOpen(true);
    };

    const handleAdminCreate = () => {
        setCurrentTask(null);
        setFormData(initialFormData);
        setIsEditModalOpen(true);
    };
    
    // Handlers for the Worker status modal
    const handleWorkerStatusUpdate = (task) => {
        setTaskForStatusUpdate(task);
        setIsStatusModalOpen(true);
    };

    // Generic handler for the Edit button in the table
    const handleEditClick = (task) => {
        if (user.role === 'admin') {
            handleAdminEdit(task);
        } else if (user.role === 'worker') {
            handleWorkerStatusUpdate(task);
        }
    };
    
    // Handler for deleting a task (only for admins)
    const handleDelete = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await apiClient.delete(`/tasks/tasks/${taskId}/`);
                fetchTasks(); // Refresh list
            } catch (err) {
                setError("Failed to delete task.");
                console.error(err);
            }
        }
    };

    // Handler for the Admin form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // Simple validation can be added here
        const endpoint = currentTask ? `/tasks/tasks/${currentTask.id}/` : '/tasks/tasks/';
        const method = currentTask ? 'put' : 'post';

        try {
            await apiClient[method](endpoint, formData);
            setIsEditModalOpen(false);
            fetchTasks(); // Refresh list
        } catch (err) {
            setFormErrors(err.response?.data || { detail: "An error occurred." });
            console.error(err);
        }
    };
    

    if (isLoading) return <div className="text-center py-10">Loading tasks...</div>;
    if (error) return <div className="bg-red-100 p-4 rounded-md">{error}</div>;

    return (
        <div className="p-1">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-semibold text-gray-800">Tasks</h1>
                {user.role === 'admin' && (
                    <button
                        onClick={handleAdminCreate}
                        className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-5 rounded-lg flex items-center justify-center space-x-2 shadow-md"
                    >
                        <PlusCircleIcon className="w-5 h-5" />
                        <span>Add New Task</span>
                    </button>
                )}
            </div>

            {/* Tasks Table */}
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    {tasks.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tasks.map((task) => (
                                    <tr key={task.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.assigned_to?.username || 'Unassigned'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.due_date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button onClick={() => handleEditClick(task)} className="text-indigo-600 hover:text-indigo-800 p-1" title={user.role === 'admin' ? "Edit Task" : "Update Status"}>
                                                <EditIcon className="w-5 h-5" />
                                            </button>
                                            {user.role === 'admin' && (
                                                <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:text-red-800 p-1" title="Delete Task">
                                                    <Trash2Icon className="w-5 h-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-10">
                            <ArchiveIcon className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                            <p className="text-gray-500">No tasks found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Admin's Full Edit/Create Modal */}
            {user.role === 'admin' && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={currentTask ? 'Edit Task' : 'Create New Task'}>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        {adminTaskFormFields.map(field => (
                             <div key={field.name}>
                                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</label>
                                {field.type === 'select_related' ? (
                                    <SelectRelatedField {...field} id={field.name} value={formData[field.name]} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} />
                                ) : field.type === 'select' ? (
                                    <select id={field.name} name={field.name} value={formData[field.name] || ''} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 bg-white">
                                        <option value="">{field.placeholder || `Select ${field.label}`}</option>
                                        {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                ) : (
                                    <input 
                                        type={field.type || 'text'} 
                                        id={field.name} 
                                        name={field.name} 
                                        value={formData[field.name] || ''} 
                                        onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5"
                                    />
                                )}
                             </div>
                        ))}
                        <div className="flex justify-end space-x-3 pt-5">
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm bg-gray-100 rounded-md">Cancel</button>
                            <button type="submit" className="px-5 py-2 text-sm text-white bg-green-600 rounded-md">Save</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Worker's Status Update Modal */}
            {user.role === 'worker' && taskForStatusUpdate && (
                <UpdateTaskStatusModal
                    isOpen={isStatusModalOpen}
                    onClose={() => setIsStatusModalOpen(false)}
                    task={taskForStatusUpdate}
                    onTaskUpdate={fetchTasks} // Pass fetchTasks to refresh the list on update
                />
            )}
        </div>
    );
};

export default TasksPage;
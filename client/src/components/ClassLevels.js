import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
});

const ClassLevels = () => {
    // State for storing class levels and form data
    const [classLevels, setClassLevels] = useState([]);
    const [form, setForm] = useState({
        level_name: '',
        description: '',
        class_id: null,
    });

    // Fetch class levels from the backend
    useEffect(() => {
        const fetchClassLevels = async () => {
            try {
                const response = await api.get('/classlevels');
                setClassLevels(response.data);
            } catch (error) {
                console.error('Error fetching class levels:', error);
            }
        };
        fetchClassLevels();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Handle Add/Edit subject
    const handleSubmit = async () => {
        const { level_name, description, class_id } = form;

        try {
            if (class_id) {
                // Edit existing class
                await api.put(`/classlevels/${class_id}`, {
                    level_name,
                    description,
                });
            } else {
                // Add new subject
                await api.post('/classlevels', {
                    level_name,
                    description,
                });
            }
            // Reset form and fetch updated classes
            setForm({ level_name: '', description: '', class_id: null });
            const response = await api.get('/classlevels');
            setClassLevels(response.data);
        } catch (error) {
            console.error('Error adding/editing classes:', error);
        }
    };

    // Handle edit classlevels
    const handleEdit = (classLevel) => {
        setForm({
            level_name: classLevel.level_name,
            description: classLevel.description,
            class_id: classLevel.class_id,
        });
    };

    // Handle delete subject
    const handleDelete = async (class_id) => {
        try {
            await api.delete(`/classlevels/${class_id}`);
            // Fetch updated subjects after deletion
            const response = await api.get('/classlevels');
            setClassLevels(response.data);
        } catch (error) {
            console.error('Error deleting subject:', error);
        }
    };

    //Handle cancel changes
    const handleCancel = (subject) => {
      setForm({
          level_name: '',
          description: '',
          class_id: null,
      });
  };

    return (
        <div className="container">
            <div className="row">
                {/* Left Section: Class List */}
                <div className="col-md-9">
                   <h4 className='admin-table-header1'>Classes List</h4>
                    <table className="table table-striped">
                        <thead>
                            <tr >
                                <th>Class ID</th>
                                <th>Class Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classLevels.map((classLevel) => (
                                <tr key={classLevel.class_id}>
                                    <td>{classLevel.class_id}</td>
                                    <td>{classLevel.level_name}</td>
                                    <td>{classLevel.description}</td>
                                    <td>                                      
                                      {/* Material UI Edit Icon Button */}
                                      <IconButton
                                            color="primary"
                                            onClick={() => handleEdit(classLevel)}
                                        >
                                            <EditIcon />
                                        </IconButton>

                                      {/* Material UI Delete Icon Button */}
                                      <IconButton
                                            color="error"
                                            onClick={() => handleDelete(classLevel.class_id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Right Section: Add/Edit Form */}
                <div className="col-md-3">
                   <h4 className='admin-table-header'>{form.class_id ? 'Edit Class' : 'Add New Class'}</h4> 
                    <form>
                        <div className="mb-3">
                            <label htmlFor="level_name" className="form-label">Class Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="level_name"
                                name="level_name"
                                value={form.level_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <input
                                type="text"
                                className="form-control"
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='custom-metadata-add'>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            {form.class_id ? 'Save Changes' : 'Add Class'}
                        </button>
                        {form.class_id && (<button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>)}
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClassLevels;
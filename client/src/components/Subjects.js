import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`,
});

const Subjects = () => {
    // State for storing subjects and form data
    const [subjects, setSubjects] = useState([]);
    const [form, setForm] = useState({
        subject_name: '',
        description: '',
        class_id: '',
        subject_id: null, // null for new subject
    });

    // Fetch subjects from the backend
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await api.get('/subjects');
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };
        fetchSubjects();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Handle Add/Edit subject
    const handleSubmit = async () => {
        const { subject_name, description, class_id, subject_id } = form;

        try {
            if (subject_id) {
                // Edit existing subject
                await api.put(`/subjects/${subject_id}`, {
                    subject_name,
                    description,
                    class_id,
                });
            } else {
                // Add new subject
                await api.post('/subjects', {
                    subject_name,
                    description,
                    class_id,
                });
            }
            // Reset form and fetch updated subjects
            setForm({ subject_name: '', description: '', class_id: '', subject_id: null });
            const response = await api.get('/subjects');
            setSubjects(response.data);
        } catch (error) {
            console.error('Error adding/editing subject:', error);
        }
    };

    // Handle edit subject
    const handleEdit = (subject) => {
        setForm({
            subject_name: subject.subject_name,
            description: subject.description,
            class_id: subject.class_id,
            subject_id: subject.subject_id,
        });
    };

    // Handle delete subject
    const handleDelete = async (subject_id) => {
        try {
            await api.delete(`/subjects/${subject_id}`);
            // Fetch updated subjects after deletion
            const response = await api.get('/subjects');
            setSubjects(response.data);
        } catch (error) {
            console.error('Error deleting subject:', error);
        }
    };

    //Handle cancel changes
    const handleCancel = (subject) => {
      setForm({
          subject_name: '',
          description: '',
          class_id: '',
          subject_id: null,
      });
  };

    return (
        <div className="container">
            <div className="row">
                {/* Left Section: Subject List */}
                <div className="col-md-9">
                   <h4 className='admin-table-header1'>Subjects List</h4>
                    <table className="table table-striped">
                        <thead>
                            <tr >
                                <th>Subject ID</th>
                                <th>Subject Name</th>
                                <th>Description</th>
                                <th>Class ID</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject) => (
                                <tr key={subject.subject_id}>
                                    <td>{subject.subject_id}</td>
                                    <td>{subject.subject_name}</td>
                                    <td>{subject.description}</td>
                                    <td>{subject.class_id}</td>
                                    <td>                                      
                                      {/* Material UI Edit Icon Button */}
                                      <IconButton
                                            color="primary"
                                            onClick={() => handleEdit(subject)}
                                        >
                                            <EditIcon />
                                        </IconButton>

                                      {/* Material UI Delete Icon Button */}
                                      <IconButton
                                            color="error"
                                            onClick={() => handleDelete(subject.subject_id)}
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
                   <h4 className='admin-table-header'>{form.subject_id ? 'Edit Subject' : 'Add New Subject'}</h4> 
                    <form>
                        <div className="mb-3">
                            <label htmlFor="subject_name" className="form-label">Subject Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="subject_name"
                                name="subject_name"
                                value={form.subject_name}
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
                        <div className="mb-3">
                            <label htmlFor="class_id" className="form-label">Class ID</label>
                            <input
                                type="number"
                                className="form-control"
                                id="class_id"
                                name="class_id"
                                value={form.class_id}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='custom-metadata-add'>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            {form.subject_id ? 'Save Changes' : 'Add Subject'}
                        </button>
                        {form.subject_id && (<button
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

export default Subjects;

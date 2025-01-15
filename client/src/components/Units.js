import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
});

const Units = () => {
    // State for storing units and form data
    const [units, setUnits] = useState([]);
    const [form, setForm] = useState({
        unit_name: '',
        subject_id: '',
        subject_name: '',
        unit_id: null, // null for new unit
    });

    // Fetch units from the backend
    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await api.get('/units');
                setUnits(response.data);
            } catch (error) {
                console.error('Error fetching units:', error);
            }
        };
        fetchUnits();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Handle Add/Edit unit
    const handleSubmit = async () => {
        const { unit_name, subject_id, subject_name, unit_id } = form;

        try {
            if (unit_id) {
                // Edit existing unit
                await api.put(`/units/${unit_id}`, {
                    unit_name,
                    subject_id,
                });
            } else {
                // Add new unit
                await api.post('/units', {
                    unit_name,
                    subject_id,
                });
            }
            // Reset form and fetch updated units
            setForm({ unit_name: '', subject_id: '', subject_name: '', unit_id: null });
            const response = await api.get('/units');
            setUnits(response.data);
        } catch (error) {
            console.error('Error adding/editing unit:', error);
        }
    };

    // Handle edit unit
    const handleEdit = (unit) => {
        setForm({
            unit_name: unit.unit_name,
            subject_id: unit.subject_id,
            subject_name: unit.subject_name,
            unit_id: unit.unit_id,
        });
    };

    // Handle delete unit
    const handleDelete = async (unit_id) => {
        try {
            await api.delete(`/units/${unit_id}`);
            // Fetch updated units after deletion
            const response = await api.get('/units');
            setUnits(response.data);
        } catch (error) {
            console.error('Error deleting unit:', error);
        }
    };

    //Handle cancel changes
    const handleCancel = (unit) => {
      setForm({
          unit_name: '',
          subject_id: '',
          subject_name: '',
          unit_id: null,
      });
  };

    return (
        <div className="container">
            <div className="row">
                {/* Left Section: Subject List */}
                <div className="col-md-9">
                   <h4 className='admin-table-header1'>Units List</h4>
                    <table className="table table-striped">
                        <thead>
                            <tr >
                                <th>Unit ID</th>
                                <th>Unit Name</th>
                                <th>Subject ID</th>
                                <th>Subject Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {units.map((unit) => (
                                <tr key={unit.unit_id}>
                                    <td>{unit.unit_id}</td>
                                    <td>{unit.unit_name}</td>
                                    <td>{unit.subject_id}</td>
                                    <td>{unit.subject_name}</td>
                                    <td>                                      
                                      {/* Material UI Edit Icon Button */}
                                      <IconButton
                                            color="primary"
                                            onClick={() => handleEdit(unit)}
                                        >
                                            <EditIcon />
                                        </IconButton>

                                      {/* Material UI Delete Icon Button */}
                                      <IconButton
                                            color="error"
                                            onClick={() => handleDelete(unit.unit_id)}
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
                   <h4 className='admin-table-header'>{form.unit_id ? 'Edit Unit' : 'Add New Unit'}</h4> 
                    <form>
                        <div className="mb-3">
                            <label htmlFor="unit_name" className="form-label">Unit Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="unit_name"
                                name="unit_name"
                                value={form.unit_name}
                                onChange={handleChange}
                            />
                        </div>
 
                        <div className="mb-3">
                            <label htmlFor="subject_id" className="form-label">Subject ID</label>
                            <input
                                type="number"
                                className="form-control"
                                id="subject_id"
                                name="subject_id"
                                value={form.subject_id}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='custom-metadata-add'>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            {form.unit_id ? 'Save Changes' : 'Add Subject'}
                        </button>
                        {form.unit_id && (<button
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

export default Units;

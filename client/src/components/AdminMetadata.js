import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Subjects from './Subjects';
import Units from './Units';
import ClassLevels from './ClassLevels';
import Questions from './Questions';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
});

const AdminMetadata = () => {
    const [selectedType, setSelectedType] = useState('class');
    const [data, setData] = useState([]);
    const [form, setForm] = useState({ name: '', description: '', class_id: '' });
    const [editId, setEditId] = useState(null);


    useEffect(() => {        
        fetchData();
    }, [selectedType]);

    const fetchData = async () => {
        try {
            const response = await api.get(`/${selectedType}s`);
            setData(response.data);
        } catch (err) {
            console.error(err);
        }
    };


    const handleAddOrUpdate = async () => {
        try {
            if (editId) {
                await api.put(`/${selectedType}s/${editId}`, form);
            } else {
                await api.post(`/${selectedType}s`, form);
            }
            setForm({ name: '', description: '', class_id: '' });
            setEditId(null);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (item) => {
        setForm({
            name: item.subject_name || item.unit_name,
            description: item.description || '',
            class_id: item.class_id || '',
        });
        setEditId(item.subject_id || item.unit_id);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/${selectedType}s/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='container'>
          <h2 className="text-center mt-5 custom-page-title">Manage Metadata</h2>
          <div className='custom-metadata-header'>
            <p>Select metadata type</p>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="class">Class</option>
                <option value="subject">Subject</option>
                <option value="unit">Unit</option>
                <option value="questions">Questions</option>
            </select>
            </div>
            {selectedType ==='class' && <ClassLevels />}
            {selectedType ==='subject' && <Subjects />}
            {selectedType ==='unit' && <Units />}
            {selectedType ==='questions' && <Questions />}
        </div>
    );
};

export default AdminMetadata;

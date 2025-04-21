import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

const API_URL = 'http://localhost:5000/api/employees';

export default function EmployeeMaster() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setRows)
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const handleAdd = async () => {
    const newEmployee = {
      name: '',
      position: '',
      rate: 0,
      phone: '',
      nic: '',
      address: '',
      startDate: '',
      status: 'Active'
    };
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee)
      });
      const data = await res.json();
      setRows(prev => [...prev, data]);
    } catch (err) {
      console.error("Failed to fetch", err);
    }
  };
  

  const handleRowEdit = async (updatedRow) => {
    const res = await fetch(`${API_URL}/${updatedRow._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRow)
    });
    const data = await res.json();
    setRows(prev => prev.map(r => r._id === data._id ? data : r));
  };
  

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setRows(prev => prev.filter(r => r._id !== id));
  };
  

  const columns = [
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    { field: 'position', headerName: 'Position', width: 150, editable: true },
    { field: 'rate', headerName: 'Rate', width: 100, editable: true },
    { field: 'phone', headerName: 'Phone', width: 130, editable: true },
    { field: 'nic', headerName: 'NIC', width: 120, editable: true },
    { field: 'address', headerName: 'Address', width: 150, editable: true },
    { field: 'startDate', headerName: 'Start Date', width: 120, editable: true },
    { field: 'status', headerName: 'Status', width: 100, editable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        <Button color="error" onClick={() => handleDelete(params.id)}>Delete</Button>
      ),
      sortable: false,
      width: 100
    }
  ];

  return (
    <div style={{ height: 600, width: '100%' }}>
      <Button onClick={handleAdd} variant="contained" color="primary" style={{ margin: '10px 0' }}>
        Add Employee
      </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        getRowId={(row) => row._id}
        onRowEditStop={(params) => handleRowEdit(params.row)}
      />
    </div>
  );
}

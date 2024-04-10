import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TableWithPagination.css'; 



const TableWithPagination = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isCreateActive, setIsCreateActive] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(Math.ceil(data.length / itemsPerPage));
  };
 
  const handleUpdate = (id) => {
    setSelectedItemId(id);
   
    console.log('Update item with ID:', id);
  };

  const handleUpdatedData = (updatedData) => {
    const updatedItems = data.map(item => {
      if (item.id === updatedData.id) {
        return updatedData;
      }
      return item;
    });
    setData(updatedItems);
    setSelectedItemId(null); 
  };

  const handleCreate = () => {
    setIsCreateActive(true);
  };

  const handleFormSubmit = async (formData) => {
    try {

      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', formData);
     
      setData([...data, response.data]);
      setIsCreateActive(false);
    } catch (error) {
      console.error('Error creating data:', error);
    }
  };

  return (
    <div>
      <h1>Table With Pagination</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Body</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.body}</td>
              <td>
                <button onClick={() => handleUpdate(item.id)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={handleFirstPage} disabled={currentPage === 1}>First Page</button>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(data.length / itemsPerPage)}>Next</button>
        <button onClick={handleLastPage} disabled={currentPage === Math.ceil(data.length / itemsPerPage)}>Last Page</button>
      </div>
      <div>
        <button onClick={handleCreate}>Create</button>
      </div>
      {isCreateActive && (
        <CreateForm onSubmit={handleFormSubmit} onCancel={() => setIsCreateActive(false)} />
      )}
      {selectedItemId && (
        <UpdateForm itemId={selectedItemId} onCancel={() => setSelectedItemId(null)} onUpdate={handleUpdatedData} />
      )}
    </div>
  );
};

const CreateForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ title: '', body: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" name="title" value={formData.title} onChange={handleChange} />
      </label>
      <label>
        Body:
        <textarea name="body" value={formData.body} onChange={handleChange}></textarea>
      </label>
      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

const UpdateForm = ({ itemId, onCancel, onUpdate }) => {
  const [formData, setFormData] = useState({ title: '', body: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://jsonplaceholder.typicode.com/posts/${itemId}`, formData);
      onUpdate(response.data);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Update Item</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </label>
        <label>
          Body:
          <textarea name="body" value={formData.body} onChange={handleChange}></textarea>
        </label>
        <button type="submit">Update</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default TableWithPagination;

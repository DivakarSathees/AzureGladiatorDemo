import React, { useState, useEffect } from 'react';
import './LoanForm.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { apiUrl } from '../apiconfig';

const LoanForm = () => {
  const navigate = useNavigate();
  var { id } = useParams();

  const [formData, setFormData] = useState({
    loanType: '',
    description: '',
    interestRate: '',
    maxAmount: '',
  });

  const [errors, setErrors] = useState({
    loanType: '',
    description: '',
    interestRate: '',
    maxAmount: '',
  });

  useEffect(() => {
    if (id) {
      fun(id);
    }
  }, [id]);

  async function fun(id) {
    try {
      const response = await axios.get(apiUrl+`/api/Loan/${id}`);
      console.log('response.data in edit', response.data);

      setFormData({
        loanType: response.data.loanType,
        description: response.data.description,
        interestRate: response.data.interestRate,
        maxAmount: response.data.maximumAmount,
      });
    } catch (error) {
      console.error('Error fetching loan data:', error);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };



  async function handleAddLoan() {
    const fieldErrors = {};


    if (!formData.loanType) {
      fieldErrors.loanType = 'Loan Type is required';
    } else {
      fieldErrors.loanType = '';
    }

    if (!formData.description) {
      fieldErrors.description = 'Description is required';
    } else {
      fieldErrors.description = '';
    }

    if (!formData.interestRate) {
      fieldErrors.interestRate = 'Interest Rate is required';
    } else {
      fieldErrors.interestRate = '';
    }

    if (!formData.maxAmount) {
      fieldErrors.maxAmount = 'Maximum Amount is required';
    } else {
      fieldErrors.maxAmount = '';
    }


    if (Object.values(fieldErrors).some((error) => error !== '')) {
      // Handle errors
      setErrors(fieldErrors);
    } else {
      try {
        // Construct the request object
        let requestObject = {
          loanType: formData.loanType,
          description: formData.description,
          interestRate: formData.interestRate,
          maximumAmount: formData.maxAmount,
          IdProof: formData.file, // Add base64 file to the request object
        };
console.log("requestObject",requestObject);
        // Make the API request
        if (id) {
          const response = await axios.put(apiUrl+`/api/Loan/${id}`, requestObject);
          console.log('Update response:', response);

          if (response.status === 204) {
            navigate(-1);
          }
        } else {
          const response = await axios.post(apiUrl+'/api/Loan', requestObject);
          console.log('Add response:', response);

          if (response.status === 200) {
            navigate(-1);
          }
        }

        // Reset form data
        setFormData({
          loanType: '',
          description: '',
          interestRate: '',
          maxAmount: '',
          file: null,
        });
      } catch (error) {
        console.error('Error handling loan:', error);
      }
    }
  }

  return (
    <div className="loan-form-container">
      <button type="button" id="backbutton" onClick={() => navigate(-1)}>
        Back
      </button>
      {id === undefined ? <h2>Create New Loan</h2> : <h2>Edit Loan</h2>}
      <form>
        <input
          type="text"
          name="loanType"
          value={formData.loanType}
          placeholder="Loan Type"
          onChange={handleChange}
        />
        {errors.loanType && <div className="error">{errors.loanType}</div>}
        <input
          type="text"
          name="description"
          value={formData.description}
          placeholder="Loan Description"
          onChange={handleChange}
        />
        {errors.description && <div className="error">{errors.description}</div>}
        <input
          type="number"
          name="interestRate"
          value={formData.interestRate}
          placeholder="Interest Rate"
          onChange={handleChange}
        />
        {errors.interestRate && <div className="error">{errors.interestRate}</div>}
        <input
          type="number"
          name="maxAmount"
          value={formData.maxAmount}
          placeholder="Maximum Amount"
          onChange={handleChange}
        />
                {errors.maxAmount && <div className="error">{errors.maxAmount}</div>}

        <button type="button" className='addbutton' onClick={handleAddLoan}>
          {id === undefined ? 'Add Loan' : 'Update Loan'}
        </button>
      </form>
    </div>
  );
};

export default LoanForm;

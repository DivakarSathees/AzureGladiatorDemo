import React, { useState } from 'react';
import "./LoanApplicationForm.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../apiconfig';
function LoanApplicationForm() {
    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    requestedAmount: '',
    submissionDate: '',
    employmentStatus: '',
    income: '',
    creditScore: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});

  async function handleSubmit() {
    const fieldErrors = {};


    if (formData.requestedAmount === '') {
      fieldErrors.requestedAmount = 'Requested Amount is required';
    }

   

    if (formData.employmentStatus === '') {
      fieldErrors.employmentStatus = 'Employment Status is required';
    }

    if (formData.income === '') {
      fieldErrors.income = 'Income is required';
    }

    if (formData.creditScore === '') {
      fieldErrors.creditScore = 'Credit Score is required';
    }
    if (!selectedFile) {
      fieldErrors.file='Please select a file.'
    }

    setErrors(fieldErrors);

    // Check if there are any errors
    const hasErrors = Object.values(fieldErrors).some((error) => error !== '');

    if (hasErrors) {
      // Handle the form errors, e.g., display a message or style the input fields
    } else {
      // Proceed with form submission
 



try{

    const fileFormData = new FormData();
    fileFormData.append('blobs', selectedFile);
  
    
  
        let requestObject ={
          "userId":localStorage.getItem("userId"),
          "userName":localStorage.getItem("userName"),
          "loanType":localStorage.getItem("loanType"),
          "requestedAmount":formData.requestedAmount,
          "submissionDate":new Date(),
          "employmentStatus":formData.employmentStatus,
          "income":formData.income,
          "creditScore":formData.creditScore,
          "loanStatus":0,
          "IdProofs":selectedFile
        }
      console.log("requestObject",requestObject)
        const response = await axios.post(
          apiUrl+"/api/LoanApplication/AddLoanApplication",
          requestObject,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
            console.log("response in application",response)
        

    
            if (response.status == 200) {
              navigate("/appliedloan")
                }


     

//axios call

}
catch(error){

console.log("error is",error);

if(error.response.data.includes("already exists")&&error.response.data.includes("File upload error"))
{
console.log("came");
  setErrors({ ...errors, file: 'Proof already exists, Please upload a different file.' });
  setFormData({ ...formData, file: '' })
}

}
      // Add logic to submit the data (e.g., send it to a server)
    }
  }
  const handleFileChange = (event) => {
    if (event.target.files.length === 0) {
      console.log('No file selected');
      return;
    }

    const file = event.target.files[0];
    const fileType = file.type;

    if (fileType !== 'application/pdf' && fileType !== 'image/jpeg') {
      setErrors({ ...errors, file: 'Please upload a PDF or JPG file' });
      event.target.value = null; // This will remove the chosen file
      return;
    }

    setSelectedFile(file);
    setErrors({ ...errors, file: '' });
  };

  
  
 

  return (
    <div> 
    <button onClick={()=>{
        navigate(-1)
    }}> Back</button>
      <h2>Loan Application Form</h2>
      <div id="container">

        <div>
          <label for="RequestedAmount" >Requested Amount:</label>
          <input
          id="RequestedAmount"
            type="number"
            name="requestedAmount"
            value={formData.requestedAmount}
            onChange={(e) => 
              {
                setFormData({ ...formData, requestedAmount: e.target.value })
  setErrors({ ...errors, requestedAmount: '' })

               }
            
            }
          />
          {errors.requestedAmount && <div className="error">{errors.requestedAmount}</div>}
        </div>

        <div>
          <label for="employmentStatus">Employment Status:</label>
          <input
          id="employmentStatus"
            type="text"
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={(e) => 
              
{
  setFormData({ ...formData, employmentStatus: e.target.value })
  setErrors({ ...errors, employmentStatus: '' })
}            
            
            
            }
          />
          {errors.employmentStatus && <div className="error">{errors.employmentStatus}</div>}
        </div>

        <div>
          <label for="income">Income:</label>
          <input
          id="income"
            type="number"
            name="income"
            value={formData.income}
            onChange={(e) => 
              
{
  setFormData({ ...formData, income: e.target.value })
  setErrors({ ...errors, income: '' })
}            
            
            }
          />
          {errors.income && <div className="error">{errors.income}</div>}
        </div>

        <div>
          <label for="creditScore">Credit Score:</label>
          <input

          id="creditScore"
            type="number"
            name="creditScore"
            value={formData.creditScore}
            onChange={(e) => 
              
              {
                setFormData({ ...formData, creditScore: e.target.value })
                setErrors({ ...errors, creditScore: '' })
              
              }}
          />
          {errors.creditScore && <div className="error">{errors.creditScore}</div>}
        </div>

      <div>
        <label htmlFor="file">Proof:</label>
      <input id="file" type="file" onChange={handleFileChange} />
        {errors.file && <div className="error">{errors.file}
        
        </div>}

      </div>
        <button type="button" className="submit-button button-green" onClick={async()=>{
          await handleSubmit()
        }}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default LoanApplicationForm;

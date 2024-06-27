import React, { useState, useEffect } from 'react';
import './LoanRequest.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../apiconfig';

const LoanRequests = () => {
  const [loanRequests, setLoanRequests] = useState([]);
  const navigate = useNavigate();

  // Simulate fetching loan requests from an API
  useEffect(() => {

     fun()
  }, []);
async function fun()
{
    const response = await axios.get(apiUrl+'/api/LoanApplication/GetAllLoanApplications');
console.log("response in loan request",response.data)
    setLoanRequests(response.data);
}
 async function handleApprove(id){
    console.log("handleApprove",id)
    // Update the status of the loan request to "Approved" and toggle the action button text
    let updatedRequest={}
     loanRequests.map((request) => {
        if (request.loanApplicationID === id) {
          updatedRequest=request;
        }
      });

      let requestObject ={
        "userId":localStorage.getItem("userId"),
        "userName":localStorage.getItem("userName"),
        "loanType":updatedRequest.loanType,
        "requestedAmount":updatedRequest.requestedAmount,
        "submissionDate":updatedRequest.submissionDate,
        "employmentStatus":updatedRequest.employmentStatus,
        "income":updatedRequest.income,
        "creditScore":updatedRequest.creditScore,
        "loanStatus":1
    }
    console.log("requestObject",requestObject)
    const response = await axios.put(apiUrl+'/api/LoanApplication/'+id,requestObject);
        console.log("response",response)
      if (response.status == 204) {
        fun()
      }
      // setLoanRequests(updatedRequests);

  };

  async function handleReject(id) {
    let updatedRequest={}
     loanRequests.map((request) => {
        if (request.loanApplicationID === id) {
          updatedRequest=request;
        }
      });

      let requestObject ={
        "userId":localStorage.getItem("userId"),
        "userName":localStorage.getItem("userName"),
        "loanType":updatedRequest.loanType,
        "requestedAmount":updatedRequest.requestedAmount,
        "submissionDate":updatedRequest.submissionDate,
        "employmentStatus":updatedRequest.employmentStatus,
        "income":updatedRequest.income,
        "creditScore":updatedRequest.creditScore,
        "loanStatus":2
    }
    console.log("requestObject",requestObject)
      //  console.log("requestObject",requestObject)
  try{
    const response = await axios.put(apiUrl+'/api/LoanApplication/'+id,requestObject);
    console.log("response",response)
  if (response.status == 204) {
    fun()
  }
  }catch{

  }
  };


  return (
    <div>
      <button className='back-button'
        onClick={() => {
          navigate(-1);
        }}
      >
        Back
      </button>
      <h1>Loan Requests for Approval</h1>

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Loan Type</th>
            <th>Requested Amount</th>
            <th>Submission Date</th>
            <th>Employment Status</th>
            <th>Income</th>
            <th>Credit Score</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
       {loanRequests.length? <tbody>
          {loanRequests.map((request) => (
            <tr key={request.loanApplicationID}>
              <td>{request.userName}</td>
              <td>{request.loanType}</td>
              <td>${request.requestedAmount}</td>
              <td>{new Date(request.submissionDate).toLocaleDateString()}</td>              <td>{request.employmentStatus}</td>
              <td>${request.income}</td>
              <td>{request.creditScore}</td>
              <td>{(request.loanStatus==0)?"Pending":(request.loanStatus==1)?"Approved":"Rejected"}</td>
              <td>
                  <div>
                  {(request.loanStatus ==0 || request.loanStatus== 2) && (
                <button         className="approve"

                      onClick={() => {
                        console.log(request.loanApplicationID)
                        handleApprove(request.loanApplicationID);
                      }}
                    >
                    Approve
                    </button>
                    )}
                    {(request.loanStatus === 0 || request.loanStatus === 1 )&& (

                    <button         className="reject"

                      onClick={() => {
                        handleReject(request.loanApplicationID);
                      }}
                    >
                    Reject
                    </button>  )}

                  </div>

              </td>
            </tr>
          ))}
        </tbody>:"No Records Found"}
      </table>
    </div>
  );
};

export default LoanRequests;

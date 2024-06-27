import React, { useState,useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../apiconfig';

const HomePage = () => {
    const navigate = useNavigate();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [loanToDelete, setLoanToDelete] = useState(null);
    const[availableLoans, setAvailableLoans]=useState([])
    // Sample data for available loans (you can replace this with actual data)
    useEffect(()=>{
        fun()
    },[])
    async function fun()
    {
        const response = await axios.get(apiUrl+'/api/Loan');
        console.log("response in getall",response)
        setAvailableLoans(response.data)
    }

    const handleDeleteClick = (loan) => {
        setLoanToDelete(loan);
        setShowDeletePopup(true);
    };

    async function handleConfirmDelete(){
       try{
        if (loanToDelete) {
            const response = await axios.delete(apiUrl+'/api/Loan/'+loanToDelete);
            console.log("response in delete",response)
            if(response.status==204)
            {
                fun()

            }
            closeDeletePopup()
            }
       }catch{

       }
    };

    const closeDeletePopup = () => {
        setLoanToDelete(null);
        setShowDeletePopup(false);
    };

    return (
        <div >

          <div className={showDeletePopup ? "delete-popup-active" : ""}>
          <button  id="logoutbutton" onClick={()=>{
                navigate("/user/login");
                localStorage.clear();
            }}>Logout</button>
            <div id="loanHomeBody">
                <h1>Vehicle Loan Application</h1>
                <button id="req_button" onClick={() => navigate("/loanrequest")}>Loans Requested</button>
                <button id="new_button" onClick={() => navigate("/newloan")}>Create New</button>

                {/* Available Loans Table */}
                <table className="loan-table">
                    <thead>
                        <tr>
                            <th>LoanType</th>
                            <th>Maximum Amount</th>
                            <th>Interest Rate</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                   {availableLoans.length?   <tbody>
                        {availableLoans?.map((loan) => (
                            <tr key={loan.loanID}>
                                <td>{loan.loanType}</td>
                                <td>${loan.maximumAmount}</td>
                                <td>{loan.interestRate}%</td>
                                <td>{loan.description}</td>
                                <td>
                                    <button className='button-green' onClick={() => navigate("/newloan/"+loan.loanID)} >Edit</button>
                                    <button className='button-red' onClick={() => handleDeleteClick(loan.loanID)}  data-testid={`delete-button-${loan.loanID}`}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>:"No Records found"}
                </table>
            </div>
          </div>

            {/* Delete Confirmation Popup */}
            {showDeletePopup && (
                <div className="delete-popup">
                    <p>Are you sure you want to delete?</p>
                    <button className='button-red' onClick={handleConfirmDelete}>Yes, Delete</button>
                    <button onClick={closeDeletePopup}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default HomePage;

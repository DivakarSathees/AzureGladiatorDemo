import React, { useState,useEffect } from 'react';
import "./UserHomePage.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../apiconfig';



const UserHomePage = () => {
    const navigate = useNavigate();

    const[availableLoans, setAvailableLoans]=useState([])

    // Sample data for available loans (you can replace this with actual data)
    // const availableLoans = [
    //     { id: 1, description: 'Loan 1', amount: 1000, interestRate: 5, loanType: 'Bike' },
    //     { id: 2, description: 'Loan 2', amount: 2000, interestRate: 6, loanType: 'Car' },
    //     { id: 3, description: 'Loan 3', amount: 1500, interestRate: 4, loanType: 'Bike' },
    //     { id: 4, description: 'Loan 4', amount: 2500, interestRate: 6.5, loanType: 'Car' },
    //     { id: 5, description: 'Loan 5', amount: 1800, interestRate: 4.2, loanType: 'Bike' },
    //     { id: 6, description: 'Loan 6', amount: 3000, interestRate: 7, loanType: 'Car' },
    //     // Add more loan objects as needed
    // ];

    useEffect(()=>{
        fun()
    },[])
    async function fun()
    {
      try{
        const response = await axios.get(apiUrl+'/api/Loan');
        console.log("response in getall",response)
        setAvailableLoans(response.data)
      }
      catch{

      }
    }



    const handleApplyClick = (loan) => {
        console.log("loan",loan)
        // Simulate applying for a loan (you can replace this with your actual logic)
        // For this example, we'll set a success message.

        localStorage.setItem("loanType",loan.loanType)

        navigate("/loanApplicationForm")
        // const message = `Successfully applied!`;
        // setSuccessMessage(message);
        // setShowPopup(true);

    };


    return (
        <div>
              <button id="logoutbutton" onClick={()=>{
                navigate("/user/login");
                localStorage.clear();
            }}>Logout</button>
            <div id="loanHomeBody">
                <h1>Vehicle Loan Application</h1>

                <button className='button-right'  id="appliedloanbutton"onClick={()=>{
              navigate("/appliedloan")
                }}>View Applied Loan</button>

                {/* Available Loans Table */}
                <table className="loan-table">
                    <thead>
                        <tr>
                           <th>Loan Type</th>
                            <th>Loan Description</th>
                            <th>Maximum Amount</th>
                            <th>Interest Rate</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                   { availableLoans.length? <tbody>
                        {availableLoans.map((loan) => (
                            <tr key={loan.id}>
                                <td>{loan.loanType}</td>
                                <td>{loan.description}</td>
                                <td>${loan.maximumAmount}</td>
                                <td>{loan.interestRate}%</td>
                                <td>
                                    <button className='button-green' onClick={() => handleApplyClick(loan)}>Apply</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>:"No Records Found"}
                </table>
            </div>

            {/* Success Popup */}
        </div>
    );
};

export default UserHomePage;

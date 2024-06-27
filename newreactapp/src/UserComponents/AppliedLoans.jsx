import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { apiUrl } from '../apiconfig';
const AppliedLoansPage = () => {
    const navigate = useNavigate();

//fetch the userId from the localstorage
const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [loanToDelete, setLoanToDelete] = useState(null);
const [appliedLoans,setAppliedLoans]=useState([])




useEffect(()=>{
fun()
},[])

async function fun()
{
try{
    const response = await axios.get(apiUrl+'/api/LoanApplication/GetLoanApplicationsByUserId?userId='+localStorage.getItem("userId"));
    console.log("response in get Particular loan application",response)
  if (response.status == 200) {
    setAppliedLoans(response.data)

}}
catch{
    setAppliedLoans([])

}

}


const handleDeleteClick = (loan) => {
    setLoanToDelete(loan);
    setShowDeletePopup(true);
};

async function handleConfirmDelete(){
    if (loanToDelete) {
    const response = await axios.delete(apiUrl+'/api/LoanApplication/'+loanToDelete);
    console.log("response in delete",response)
    if(response.status==204)
    {
        fun()

    }
    closeDeletePopup()
    }
};

const closeDeletePopup = () => {
    setLoanToDelete(null);
    setShowDeletePopup(false);
};
    return (
        <div>

<div className={showDeletePopup ? "delete-popup-active" : ""}>
       <button   onClick={()=>{
navigate("/availableloan")
            }}> Back</button>
            <h1>Applied Loans</h1>

            {/* Applied Loans Table */}
            <table>
                <thead>
                    <tr>
                        <th>Loan Name</th>
                        <th>Submission Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
               {appliedLoans.length? <tbody>
                    {appliedLoans.map((loan) => (
                        <tr key={loan.loanApplicationID}>
                            <td>{loan.loanType}</td>
                            <td>{new Date(loan.submissionDate).toISOString().split('T')[0]}</td>
                            <td>{loan.loanStatus==0?"Pending":(loan.loanStatus==1)?"Approved":"Rejected"}</td>
                            <td> <button className='button-red' onClick={()=>{
                                handleDeleteClick(loan.loanApplicationID)
                            }}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>:"No records Found"}
            </table>
       </div>

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

export default AppliedLoansPage;

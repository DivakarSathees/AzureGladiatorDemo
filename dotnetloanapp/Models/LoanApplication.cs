using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStoreDBFirst.Models;
public class LoanApplication
{
    public int LoanApplicationID { get; set; }
    public string userId { get; set; }
    public string userName { get; set; }
    public decimal RequestedAmount  { get; set; }
    public DateTime SubmissionDate { get; set; }
    public string EmploymentStatus  { get; set; }
    public decimal Income  { get; set; }
    public int CreditScore   { get; set; }
    public int LoanStatus   { get; set; }
    public string LoanType {get;set;}
    public string? IdProof { get; set; }
    //public List<IFormFile>? Blobs { get; set; }
    [NotMapped]
    public IFormFile? IdProofs { get; set; }

    //public string? IdProofUrl { get; set; }

}

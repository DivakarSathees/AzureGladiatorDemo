using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BookStoreDBFirst.Models
{
    public class LoanApplicationDbContext : IdentityDbContext<IdentityUser, IdentityRole, string>
    { 
    


        public DbSet<LoanApplication> LoanApplications { get; set; }
        public DbSet<Loan> Loans { get; set; }
        public DbSet<User> Users { get; set; }

        public LoanApplicationDbContext(DbContextOptions<LoanApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

        //    modelBuilder.Entity<LoanApplication>()
        //.Ignore(x => x.IdProofs)
        //.Property(x => x.IdProofUrl)
        //.HasColumnType("VARCHAR(MAX)");  // Adjust the data type as needed


            // Your additional model configurations go here
        }
    }
}

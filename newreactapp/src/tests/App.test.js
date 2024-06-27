import React from 'react';
import {act, render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Components/Login';
import LoanForm from '../Components/LoanForm';
import LoanRequest from '../Components/LoanRequest';
import Signup from '../Components/Signup';
import Home from '../Components/Home';
import AppliedLoans from "../UserComponents/AppliedLoans"
import UserHomePage from "../UserComponents/UserHomePage"
import LoanApplicationForm from "../UserComponents/LoanApplicationForm"
import '@testing-library/jest-dom'; // Import the extended matchers
import axios from 'axios'
beforeEach(() => {
  // Clear Axios mock calls before each test
  axios.post.mockClear();
  axios.get.mockClear();
  axios.put.mockClear();
  // Add more Axios methods if needed
});
jest.mock('axios');

describe('login_component', () => {
  test('should_render_the_login_form_with_username_and_password_fields', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Check if the Login header is rendered
    const loginHeader = screen.getByText('Login', { selector: 'h2' });
    expect(loginHeader).toBeInTheDocument();

    // Check if the username and password input fields are present
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    // Check if the Login button is present
    const loginButton = screen.getByText('Login', { selector: 'button' });
    expect(loginButton).toBeInTheDocument();

    // Check if the Signup link is present
    const signupLink = screen.getByText("Don't have an account?");
    expect(signupLink).toBeInTheDocument();
  });

  test('should_show_an_error_message_when_attempting_to_login_with_empty_fields', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const loginButton = screen.getByText('Login', { selector: 'button' });
    fireEvent.click(loginButton);

    // Check if error messages for username and password are displayed
    const usernameError = screen.getByText('Username is required');
    const passwordError = screen.getByText('Password is required');
    expect(usernameError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
  });

  test('should_validate_password_length_when_entering_a_password', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: '123' } });

    // Check if the error message for password length is displayed
    const passwordError = screen.getByText('Password must be at least 6 characters');
    expect(passwordError).toBeInTheDocument();
  });

  test('should_clear_error_messages_when_the_user_enters_data', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  
    // Typing in the username field should clear the error message
    const usernameInput = screen.getByPlaceholderText('Username');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    
    // Typing in the password field should clear the error message
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
  
    const loginButton = screen.getByText('Login', { selector: 'button' });
    fireEvent.click(loginButton);
  
    // Use screen.queryByText to check if the elements are not present
    const usernameError = screen.queryByText('Username is required');
    const passwordError = screen.queryByText('Password is required');
  
    expect(usernameError).toBeNull(); // Null means the element was not found
    expect(passwordError).toBeNull(); // Null means the element was not found
  });

  test('should_make_an_axios_call_to_the_login_endpoint', () => {
    // Mock the Axios post method
    const mockAxiosPost = jest.spyOn(axios, 'post');

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login', { selector: 'button' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    // Check if Axios was called with a URL that includes the expected endpoint
    expect(mockAxiosPost).toHaveBeenCalledWith(
      expect.stringContaining('/api/Auth/login'),
      expect.any(Object)
    );
 
    // Make sure to clear the mock to avoid affecting other tests
    mockAxiosPost.mockRestore();
  });
});
;

describe('signup_component', () => {
  test('should_render_the_signup_form_with_user_name_password_confirm_password_and_role_fields', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Check if the Signup header is rendered
    const signupHeader = screen.getByText('Signup', { selector: 'h2' });
    expect(signupHeader).toBeInTheDocument();

    // Check if the user name, password, confirm password, and role input fields are present
    const userNameInput = screen.getByPlaceholderText('User Name');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const roleSelect = screen.getByLabelText('Role');
    expect(userNameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(roleSelect).toBeInTheDocument();

    // Check if the Submit button is present
    const submitButton = screen.getByText('Submit', { selector: 'button' });
    expect(submitButton).toBeInTheDocument();

    // Check if the Login button is present
    const loginButton = screen.getByText("Already have an Account?");
    expect(loginButton).toBeInTheDocument();
  });

  test('should_show_an_error_message_when_attempting_to_submit_the_form_with_empty_fields', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    const submitButton = screen.getByText('Submit', { selector: 'button' });
    fireEvent.click(submitButton);

    // Check if error messages for user name, password, confirm password are displayed
    const userNameError = screen.getByText('User Name is required');
    const passwordError = screen.getByText('Password is required');
    const confirmPasswordError = screen.getByText('Confirm Password is required');
    expect(userNameError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
    expect(confirmPasswordError).toBeInTheDocument();
  });

  test('should_validate_password_length_when_entering_a_password', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: '123' } });

    // Check if the error message for password length is displayed
    const passwordError = screen.getByText('Password must be at least 6 characters');
    expect(passwordError).toBeInTheDocument();
  });

  test('should_show_an_error_message_when_passwords_do_not_match', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });

    // Check if the error message for password match is displayed
    const confirmPasswordError = screen.getByText('Passwords do not match');
    expect(confirmPasswordError).toBeInTheDocument();
  });

  test('should_clear_error_messages_when_the_user_starts_typing_in_the_fields', () => {
    const mockAxiosPost = jest.spyOn(axios, 'post');

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
  
    // Typing in the user name field should clear the error message
    const userNameInput = screen.getByPlaceholderText('User Name');
    fireEvent.change(userNameInput, { target: { value: 'testuser' } });
    
    // Typing in the password field should clear the error message
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Typing in the confirm password field should clear the error message
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
  
    const submitButton = screen.getByText('Submit', { selector: 'button' });
    fireEvent.click(submitButton);
  
    // Use screen.queryByText to check if the elements are not present
    const userNameError = screen.queryByText('User Name is required');
    const passwordError = screen.queryByText('Password is required');
    const confirmPasswordError = screen.queryByText('Confirm Password is required');
  
    expect(userNameError).toBeNull(); // Null means the element was not found
    expect(passwordError).toBeNull(); // Null means the element was not found
    expect(confirmPasswordError).toBeNull(); // Null means the element was not found
    expect(mockAxiosPost).toHaveBeenCalledWith(
      expect.stringContaining('/api/Auth/register'),
      expect.any(Object)
    );
 
    // Make sure to clear the mock to avoid affecting other tests
    mockAxiosPost.mockRestore();
  });
});

const MOCK_AVAILABLE_LOANS = [
  {
    loanID: 1,
    loanType: 'Bike',
    maximumAmount: 1000,
    interestRate: 5,
    description: 'Loan for bikes',
  },
  {
    loanID: 2,
    loanType: 'Car',
    maximumAmount: 2000,
    interestRate: 6,
    description: 'Loan for cars',
  },
  // Add more mock data as needed
];

describe('home_page_component', () => {

  beforeEach(() => {
    // Mock the Axios get and delete methods
    axios.get.mockResolvedValue({ data: MOCK_AVAILABLE_LOANS });
    axios.delete.mockResolvedValue({ status: 204 });
  });

  test('should_render_userhomepage_component_with_buttons', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Check if the "Logout" button is present
    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
  });

  test('should_render_the_home_page_with_available_loans', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Home/>
        </BrowserRouter>
      );
    });

    // Check if the Loan Center header is rendered
    const loanCenterHeader = screen.getByText('Vehicle Loan Application', { selector: 'h1' });
    expect(loanCenterHeader).toBeInTheDocument();

    // Check if the table with available loans is rendered
    const loanTable = screen.getByRole('table');
    expect(loanTable).toBeInTheDocument();

    // Check if the available loans data is displayed
    MOCK_AVAILABLE_LOANS.forEach((loan) => {
      expect(screen.getByText(loan.loanType)).toBeInTheDocument();
      expect(screen.getByText(`$${loan.maximumAmount}`)).toBeInTheDocument();
      expect(screen.getByText(`${loan.interestRate}%`)).toBeInTheDocument();
      expect(screen.getByText(loan.description)).toBeInTheDocument();
    });
  });

  test('should_handle_loan_deletion', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Home/>
        </BrowserRouter>
      );
    });

    // Find and click the delete button
    const deleteButton = screen.getByTestId('delete-button-1'); // Replace '1' with the loanID of the first loan
    fireEvent.click(deleteButton);

    // Check if the delete confirmation popup is displayed
    const deletePopup = screen.getByText('Are you sure you want to delete?', { selector: 'p' });
    expect(deletePopup).toBeInTheDocument();

    // Click the "Yes, Delete" button
    const confirmDeleteButton = screen.getByText('Yes, Delete', { selector: 'button' });
    fireEvent.click(confirmDeleteButton);

    // Check if the Axios delete function was called with the loan to delete
    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining(`/api/Loan/${MOCK_AVAILABLE_LOANS[0].loanID}`)
    );
  });
});
describe('LoanForm Component', () => {
  test('should_render_the_loanForm_for_adding_a_new_loan', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <LoanForm />
        </BrowserRouter>
      );
    });

    const addLoanButton = screen.getByText('Add Loan');
    expect(addLoanButton).toBeInTheDocument();

    // Your test assertions for rendering the form for adding a new loan
  });
  test('should_handle_adding_a_new_loan_with_validation', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ status: 200 });
  
    await act(async () => {
      render(
        <BrowserRouter>
          <LoanForm />
        </BrowserRouter>
      );
    });
  
    // Simulate user input for adding a new loan
    const loanTypeInput = screen.getByPlaceholderText('Loan Type');
    fireEvent.change(loanTypeInput, { target: { value: 'Car Loan' } });
  
    const descriptionInput = screen.getByPlaceholderText('Loan Description');
    fireEvent.change(descriptionInput, { target: { value: 'Loan for cars' } });
  
    const interestRateInput = screen.getByPlaceholderText('Interest Rate');
    fireEvent.change(interestRateInput, { target: { value: '5' } });
  
    const maxAmountInput = screen.getByPlaceholderText('Maximum Amount');
    fireEvent.change(maxAmountInput, { target: { value: '2000' } });
  
    const addLoanButton = screen.getByText('Add Loan');
    fireEvent.click(addLoanButton);
  
    // Your test assertions for adding a new loan with validation
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/Loan/),
      expect.any(Object)
    );
  });
  
  
  test('should_handle_validation_errors_when_adding_a_new_loan', async () => {
    // Mock Axios to resolve as an error (status 400) to simulate validation error

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanForm />
        </BrowserRouter>
      );
    });

    // Simulate user input for adding a new loan with missing fields
    const addLoanButton = screen.getByText('Add Loan');
    fireEvent.click(addLoanButton);

    // Your test assertions for handling validation errors
    // For example, you can expect to find error messages on the screen
    const loanTypeError = screen.getByText('Loan Type is required');
    const descriptionError = screen.getByText('Description is required');
    const interestRateError = screen.getByText('Interest Rate is required');
    const maxAmountError = screen.getByText('Maximum Amount is required');
  });
});
describe('LoanRequests Component', () => {
  test('should_render_loanRequest_component_with_mock_data', async () => {
    // Mock data for loan requests
    const mockLoanRequestsData = [
      {
        loanApplicationID: 1,
        userName: 'User1',
        loanType: 'Car Loan',
        requestedAmount: 5000,
        submissionDate: '2023-01-15',
        employmentStatus: 'Employed',
        income: 60000,
        creditScore: 700,
        loanStatus: 0,
      }
    ];
  
    jest.spyOn(axios, 'get').mockResolvedValue({ data: mockLoanRequestsData });
  
    await act(async () => {
      render(
        <BrowserRouter>
          <LoanRequest/>
        </BrowserRouter>
      );
    });
  
    const loanRequestsTable = screen.getByRole('table');
    expect(loanRequestsTable).toBeInTheDocument();
  
    // Assertions for individual fields in the table
    const userNameCell = screen.getByText('User1');
    expect(userNameCell).toBeInTheDocument();
  
    const loanTypeCell = screen.getByText('Car Loan');
    expect(loanTypeCell).toBeInTheDocument();
  
    const requestedAmountCell = screen.getByText('$5000');
    expect(requestedAmountCell).toBeInTheDocument();
  
    const submissionDateCell = screen.getByText('2023-01-15');
    expect(submissionDateCell).toBeInTheDocument();
  
    const employmentStatusCell = screen.getByText('Employed');
    expect(employmentStatusCell).toBeInTheDocument();
  
    const incomeCell = screen.getByText('$60000');
    expect(incomeCell).toBeInTheDocument();
  
    const creditScoreCell = screen.getByText('700');
    expect(creditScoreCell).toBeInTheDocument();
  
    const loanStatusCell = screen.getByText('Pending');
    expect(loanStatusCell).toBeInTheDocument();
  });
  

  test('should_handle_loan_approval', async () => {
    const mockLoanRequestID = 1; // Replace with a valid loan request ID

    // Mock the axios.put function for loan approval
    jest.spyOn(axios, 'put').mockResolvedValue({ status: 204 });

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanRequest />
        </BrowserRouter>
      );
    });

    // Simulate clicking the "Approve" button
    const approveButton = screen.getByText('Approve');
    fireEvent.click(approveButton);
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/LoanApplication\/\d+/), // Use a regex to match the URL
        expect.any(Object) // You can also check the request data here
      );
    // Your test assertions for loan approval, which should include checking the Axios PUT call
  });

  test('should_handle_loan_rejection', async () => {
    const mockLoanRequestID = 2; // Replace with a valid loan request ID

    // Mock the axios.put function for loan rejection
    jest.spyOn(axios, 'put').mockResolvedValue({ status: 204 });

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanRequest />
        </BrowserRouter>
      );
    });

    // Simulate clicking the "Reject" button
    const rejectButton = screen.getByText('Reject');
    fireEvent.click(rejectButton);
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/LoanApplication\/\d+/), // Use a regex to match the URL
        expect.any(Object) // You can also check the request data here
      );
    // Your test assertions for loan rejection, which should include checking the Axios PUT call
  });
});
describe('appliedloanspage_component', () => {
  axios.post.mockClear();
  axios.get.mockClear();
  axios.put.mockClear();

  test('should_render_appliedloanspage_component_with_loan_data', async () => {
    const mockAppliedLoansData = [
      {
        loanApplicationID: 1,
        loanType: 'Car Loan',
        submissionDate: '2023-01-15',
        loanStatus: 0,
      },
    ];

    // Mock the axios.get function for fetching loan data
    jest.spyOn(axios, 'get').mockResolvedValue({ data: mockAppliedLoansData, status: 200 });

    // Create a promise to wait for the state update
    const promise = Promise.resolve();

    await act(async () => {
      render(
        <BrowserRouter>
          <AppliedLoans />
        </BrowserRouter>
      );
      await promise; // Wait for the promise to resolve
    });

    expect(screen.getByText('Applied Loans')).toBeInTheDocument();
    const appliedLoansTable = screen.getByRole('table');
    expect(appliedLoansTable).toBeInTheDocument();

    // Check if the loan data is displayed
    const loanNameCell = screen.getByText('Car Loan');
    const submissionDateCell = screen.getByText('2023-01-15');
    const statusCell = screen.getByText('Pending');
    expect(loanNameCell).toBeInTheDocument();
    expect(submissionDateCell).toBeInTheDocument();
    expect(statusCell).toBeInTheDocument();
  });

  test('should_handle_loan_deletion', async () => {
    // Mock data for applied loans
    const mockAppliedLoansData = [
      {
        loanApplicationID: 1,
        loanType: 'Car Loan',
        submissionDate: '2023-01-15',
        loanStatus: 0,
      },
    ];

    jest.spyOn(axios, 'get').mockResolvedValue({ data: mockAppliedLoansData, status: 200 });
    jest.spyOn(axios, 'delete').mockResolvedValue({ status: 204 });

    // Create a promise to wait for the state update
    const promise = Promise.resolve();

    await act(async () => {
      render(
        <BrowserRouter>
          <AppliedLoans />
        </BrowserRouter>
      );
      await promise; // Wait for the promise to resolve
    });

    // Simulate clicking the "Delete" button
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Check if the delete confirmation popup is displayed
    const deletePopup = screen.getByText('Are you sure you want to delete?');
    expect(deletePopup).toBeInTheDocument();

    // Simulate confirming the delete
    const confirmDeleteButton = screen.getByText('Yes, Delete');
    fireEvent.click(confirmDeleteButton);

    // Check if the axios.delete function was called with the correct URL
    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringMatching('/api/LoanApplication/1')
    );
  });
});

describe('userhomepage_component', () => {
  test('should_render_userhomepage_component_with_loan_data', async () => {
    // Mock data for available loans
    const mockAvailableLoansData = [
      {
        id: 1,
        description: 'Loan 1',
        maximumAmount: 1000,
        interestRate: 5,
        loanType: 'Bike',
      }
    ];

    // Mock the axios.get function for fetching loan data
    jest.spyOn(axios, 'get').mockResolvedValue({ data: mockAvailableLoansData, status: 200 });

    // Create a promise to wait for the state update
    const promise = Promise.resolve();

    await act(async () => {
      render(
        <BrowserRouter>
          <UserHomePage />
        </BrowserRouter>
      );
      await promise; // Wait for the promise to resolve
    });

    // Check if the component renders successfully
    expect(screen.getByText('Vehicle Loan Application')).toBeInTheDocument();

    // Check if the table is rendered
    const availableLoansTable = screen.getByRole('table');
    expect(availableLoansTable).toBeInTheDocument();

    // Check if the loan data is displayed
    const loanTypeCell = screen.getByText('Bike');
    const loanDescriptionCell = screen.getByText('Loan 1');
    const maximumAmountCell = screen.getByText('$1000');
    const interestRateCell = screen.getByText('5%');
    const applyButton = screen.getByText('Apply');
    expect(loanTypeCell).toBeInTheDocument();
    expect(loanDescriptionCell).toBeInTheDocument();
    expect(maximumAmountCell).toBeInTheDocument();
    expect(interestRateCell).toBeInTheDocument();
    expect(applyButton).toBeInTheDocument();
  });

  test('should_render_userhomepage_component_with_buttons', () => {
    render(
      <BrowserRouter>
        <UserHomePage />
      </BrowserRouter>
    );

    // Check if the "View Applied Loan" button is present
    const viewAppliedLoanButton = screen.getByText('View Applied Loan');
    expect(viewAppliedLoanButton).toBeInTheDocument();

    // Check if the "Logout" button is present
    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
  });
});

describe('loanapplicationform_component', () => {
  test('should_show_validation_errors_for_empty_fields', () => {
    render(
      <BrowserRouter>
        <LoanApplicationForm />
      </BrowserRouter>
    );

    // Click the submit button without filling out the form
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    // Check if validation errors are displayed
    const requestedAmountError = screen.getByText('Requested Amount is required');
    const submissionDateError = screen.getByText('Submission Date is required');
    const employmentStatusError = screen.getByText('Employment Status is required');
    const incomeError = screen.getByText('Income is required');
    const creditScoreError = screen.getByText('Credit Score is required');

    expect(requestedAmountError).toBeInTheDocument();
    expect(submissionDateError).toBeInTheDocument();
    expect(employmentStatusError).toBeInTheDocument();
    expect(incomeError).toBeInTheDocument();
    expect(creditScoreError).toBeInTheDocument();
  });

  test('should_submit_the_form_and_make_an_api_call_on_valid_data', async () => {
    // Mock the axios.post function for form submission
    jest.spyOn(axios, 'post').mockResolvedValue({ status: 200 }); // You can change the response status as needed

    render(
      <BrowserRouter>
        <LoanApplicationForm />
      </BrowserRouter>
    );

    // Fill out the form with valid data
    const requestedAmountInput = screen.getByLabelText('Requested Amount:');
    const submissionDateInput = screen.getByLabelText('Submission Date:');
    const employmentStatusInput = screen.getByLabelText('Employment Status:');
    const incomeInput = screen.getByLabelText('Income:');
    const creditScoreInput = screen.getByLabelText('Credit Score:');

    fireEvent.change(requestedAmountInput, { target: { value: '1000' } });
    fireEvent.change(submissionDateInput, { target: { value: '2023-10-15' } });
    fireEvent.change(employmentStatusInput, { target: { value: 'Employed' } });
    fireEvent.change(incomeInput, { target: { value: '60000' } });
    fireEvent.change(creditScoreInput, { target: { value: '700' } });

    // Click the submit button
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    // Wait for the API call to resolve
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringMatching('/api/LoanApplication/AddLoanApplication'),
      expect.any(Object)
    );

    // You can also test for a success message or navigation here
  });

  // You can add more test cases for validation, such as testing for valid inputs
});

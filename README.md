# Hostel Management System

A mini Database Management System (DBMS) project for efficient hostel administration and student management.

## Overview

This project is a comprehensive hostel management system built to streamline the administrative tasks of hostel operations. It provides features for managing student records, room allocations, fee tracking, and other essential hostel operations through an intuitive web interface.

## Features

- **Student Management**: Add, update, and manage student records
- **Room Allocation**: Assign and track room allocations for students
- **Fee Management**: Monitor and manage hostel fees and payments
- **Attendance Tracking**: Keep track of student attendance
- **Complaint Management**: Log and resolve hostel-related complaints
- **Report Generation**: Generate various administrative reports
- **User Authentication**: Secure login system for different user roles (Admin, Warden, Student)

## Technology Stack

### Backend
- **Flask**:  Lightweight Python web framework for building the REST API and web application
- **MySQL**:  Relational database management system for data persistence and management

### Frontend
- HTML, CSS, JavaScript (if applicable)

## Project Structure

```
Hostel-Management/
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── database/             # Database schema and queries
├── templates/            # HTML templates
├── static/              # CSS, JavaScript, and images
├── models/              # Database models
└── routes/              # API endpoints and routes
```

## Installation

### Prerequisites
- Python 3.7+
- MySQL Server
- pip (Python package manager)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/PrathikReddy560/Hostel-management.git
   cd Hostel-management
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure MySQL database:
   - Create a new MySQL database
   - Update database credentials in `config.py`
   - Import the database schema (if provided)

5. Run the application:
   ```bash
   python app.py
   ```

6. Access the application at `http://localhost:5000`

## Usage

- Open the application in your web browser
- Log in with your credentials
- Navigate through different modules based on your user role
- Perform various operations like adding students, allocating rooms, managing fees, etc.

## Database Schema

The system uses MySQL with the following main tables: 
- `students` - Student information
- `rooms` - Room details
- `allocations` - Student room assignments
- `fees` - Fee records
- `complaints` - Student complaints
- `users` - User authentication and roles

## Future Enhancements

- Mobile application interface
- SMS/Email notifications
- Advanced analytics and dashboards
- Automated fee calculation
- Integration with payment gateways

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests for any improvements. 

## License

This project is open source and available under the MIT License. 

## Contact

For questions or support, please contact [your-email@example.com]

---

**Note**: This is a mini DBMS project developed for educational purposes. 

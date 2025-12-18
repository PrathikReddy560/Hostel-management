// Bootstrap modal for alerts
function showAlert(message, type = 'success') {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-${type}">
                    <h5 class="modal-title text-white">${type === 'success' ? 'Success' : 'Error'}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    ${message}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-${type}" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    modal.addEventListener('hidden.bs.modal', () => modal.remove());
  }
  
  // Load available rooms on page load
  document.addEventListener('DOMContentLoaded', () => {
    fetchAvailableRooms();
  });
  
  // Fetch available rooms
  async function fetchAvailableRooms() {
    try {
        const response = await fetch('http://localhost:5000/api/rooms/available');
        const rooms = await response.json();
        const roomsBody = document.getElementById('roomsBody');
        roomsBody.innerHTML = '';
        rooms.forEach(room => {
            roomsBody.innerHTML += `
                <tr>
                    <td>${room.room_number}</td>
                    <td>${room.capacity}</td>
                    <td>${room.hostel_name}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        showAlert('Failed to load rooms', 'danger');
    }
  }
  
  // Add student form submission
  document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('studentSpinner').classList.remove('d-none');
    const email = document.getElementById('email').value;
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showAlert('Please enter a valid email', 'danger');
        document.getElementById('studentSpinner').classList.add('d-none');
        return;
    }
    const studentData = {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        email: email,
        phone: document.getElementById('phone').value,
        room_id: parseInt(document.getElementById('roomId').value),
        admission_date: document.getElementById('admissionDate').value
    };
  
    try {
        const response = await fetch('http://localhost:5000/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        const result = await response.json();
        showAlert(result.message, 'success');
        document.getElementById('addStudentForm').reset();
        fetchAvailableRooms();
    } catch (error) {
        console.error('Error adding student:', error);
        showAlert('Failed to add student', 'danger');
    } finally {
        document.getElementById('studentSpinner').classList.add('d-none');
    }
  });
  
  // Fetch student details
  async function fetchStudent() {
    document.getElementById('studentSpinner').classList.remove('d-none');
    const studentId = document.getElementById('studentIdInput').value;
    if (!studentId) {
        showAlert('Please enter a student ID', 'danger');
        document.getElementById('studentSpinner').classList.add('d-none');
        return;
    }
    try {
        const response = await fetch('http://localhost:5000/api/students/${studentId}');
        const student = await response.json();
        const studentDetails = document.getElementById('studentDetails');
        if (student.error) {
            studentDetails.innerHTML = <p class="text-danger">${student.error}</p>;
        } else {
            studentDetails.innerHTML = `
                <p><strong>Name:</strong> ${student.first_name} ${student.last_name}</p>
                <p><strong>Email:</strong> ${student.email}</p>
                <p><strong>Phone:</strong> ${student.phone}</p>
                <p><strong>Room:</strong> ${student.room_number}</p>
                <p><strong>Hostel:</strong> ${student.hostel_name}</p>
            `;
        }
    } catch (error) {
        console.error('Error fetching student:', error);
        showAlert('Failed to fetch student', 'danger');
    } finally {
        document.getElementById('studentSpinner').classList.add('d-none');
    }
  }
  
  // Log complaint form submission
  document.getElementById('addComplaintForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('complaintSpinner').classList.remove('d-none');
    const complaintData = {
        student_id: parseInt(document.getElementById('complaintStudentId').value),
        description: document.getElementById('description').value,
        complaint_date: document.getElementById('complaintDate').value
    };
  
    try {
        const response = await fetch('http://localhost:5000/api/complaints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(complaintData)
        });
        const result = await response.json();
        showAlert(result.message, 'success');
        document.getElementById('addComplaintForm').reset();
    } catch (error) {
        console.error('Error logging complaint:', error);
        showAlert('Failed to log complaint', 'danger');
    } finally {
        document.getElementById('complaintSpinner').classList.add('d-none');
    }
  });
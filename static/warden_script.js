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

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchComplaints();
    fetchAvailableRooms();
});

// Fetch complaints
async function fetchComplaints() {
    try {
        const response = await fetch('http://localhost:5000/api/complaints');
        const complaints = await response.json();
        const complaintsBody = document.getElementById('complaintsBody');
        complaintsBody.innerHTML = '';
        complaints.forEach(c => {
            complaintsBody.innerHTML += `
                <tr>
                    <td>${c.complaint_id}</td>
                    <td>${c.first_name} ${c.last_name}</td>
                    <td>${c.description}</td>
                    <td>${c.complaint_date}</td>
                    <td>${c.status}</td>
                    <td>
                        <select onchange="updateComplaint(${c.complaint_id}, this.value)">
                            <option value="Open" ${c.status === 'Open' ? 'selected' : ''}>Open</option>
                            <option value="Resolved" ${c.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                        </select>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        showAlert('Failed to load complaints', 'danger');
    }
}

// Update complaint status
async function updateComplaint(complaintId, status) {
    try {
        const response = await fetch(`http://localhost:5000/api/complaints/${complaintId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        const result = await response.json();
        showAlert(result.message, 'success');
        fetchComplaints();  // Re-fetch complaints after status update
    } catch (error) {
        console.error('Error updating complaint:', error);
        showAlert('Failed to update complaint', 'danger');
    }
}

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
        fetchAvailableRooms();  // Re-fetch rooms after adding a student
    } catch (error) {
        console.error('Error adding student:', error);
        showAlert('Failed to add student', 'danger');
    } finally {
        document.getElementById('studentSpinner').classList.add('d-none');
    }
});

// Mark attendance form submission
document.getElementById('attendanceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('attendanceSpinner').classList.remove('d-none');
    const attendanceData = {
        student_id: parseInt(document.getElementById('attendanceStudentId').value),
        date: document.getElementById('attendanceDate').value,
        status: document.getElementById('attendanceStatus').value
    };

    try {
        const response = await fetch('http://localhost:5000/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attendanceData)
        });
        const result = await response.json();
        showAlert(result.message, 'success');
        document.getElementById('attendanceForm').reset();
    } catch (error) {
        console.error('Error marking attendance:', error);
        showAlert('Failed to mark attendance', 'danger');
    } finally {
        document.getElementById('attendanceSpinner').classList.add('d-none');
    }
});
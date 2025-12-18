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
    fetchAttendance();
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
  
  // Fetch attendance
  async function fetchAttendance() {
    try {
        const response = await fetch('http://localhost:5000/api/attendance');
        const attendance = await response.json();
        const attendanceBody = document.getElementById('attendanceBody');
        attendanceBody.innerHTML = '';
        attendance.forEach(a => {
            attendanceBody.innerHTML += `
                <tr>
                    <td>${a.date}</td>
                    <td>${a.status}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        showAlert('Failed to load attendance', 'danger');
    }
  }
  
  // Register complaint form submission
  document.getElementById('addComplaintForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('complaintSpinner').classList.remove('d-none');
    const complaintData = {
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
  
  // Report absence form submission
  document.getElementById('absenceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('absenceSpinner').classList.remove('d-none');
    const absenceData = {
        date: document.getElementById('absenceDate').value,
        reason: document.getElementById('absenceReason').value
    };
  
    try {
        const response = await fetch('http://localhost:5000/api/absence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(absenceData)
        });
        const result = await response.json();
        showAlert(result.message, 'success');
        document.getElementById('absenceForm').reset();
    } catch (error) {
        console.error('Error reporting absence:', error);
        showAlert('Failed to report absence', 'danger');
    } finally {
        document.getElementById('absenceSpinner').classList.add('d-none');
    }
  });
  
  // Request holiday form submission
  document.getElementById('holidayForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('holidaySpinner').classList.remove('d-none');
    const holidayData = {
        start_date: document.getElementById('startDate').value,
        end_date: document.getElementById('endDate').value,
        reason: document.getElementById('holidayReason').value
    };
  
    try {
        const response = await fetch('http://localhost:5000/api/holiday', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(holidayData)
        });
        const result = await response.json();
        showAlert(result.message, 'success');
        document.getElementById('holidayForm').reset();
    } catch (error) {
        console.error('Error requesting holiday:', error);
        showAlert('Failed to request holiday', 'danger');
    } finally {
        document.getElementById('holidaySpinner').classList.add('d-none');
    }
  });
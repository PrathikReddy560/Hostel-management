from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import mysql.connector
import bcrypt
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = '989b457237e654627cd71f227d5f8faaebc08d2b7dc4c94ef5f3d231afb92661'  # Replace with your generated key
CORS(app)

db_config = {
    'user': 'root',
    'password': 'prathik',
    'host': 'localhost',
    'database': 'hostel_management'
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

# Fetch available rooms (updated to include location)
def fetch_available_rooms():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT r.room_id, r.room_number, r.capacity, h.hostel_name, h.location
        FROM Rooms r
        JOIN Hostel h ON r.hostel_id = h.hostel_id
        WHERE r.is_occupied = FALSE
    """
    cursor.execute(query)
    rooms = cursor.fetchall()
    cursor.close()
    conn.close()
    return rooms

# Login route
@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        if session['role'] == 'warden':
            return redirect(url_for('warden_dashboard'))
        else:
            return redirect(url_for('student_dashboard'))
    if request.method == 'POST':
        data = request.form
        email = data['email']
        password = data['password'].encode('utf-8')
        form_role = data.get('role')
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM Users WHERE email = %s', (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        try:
            if user and bcrypt.checkpw(password, user['password'].encode('utf-8')):
                if user['role'] != form_role:
                    return render_template('login.html', error='Role mismatch. Please select the correct login tab.')
                session['user_id'] = user['user_id']
                session['role'] = user['role']
                session['student_id'] = user['student_id']
                if user['role'] == 'warden':
                    return redirect(url_for('warden_dashboard'))
                else:
                    return redirect(url_for('student_dashboard'))
            return render_template('login.html', error='Invalid credentials')
        except ValueError as e:
            return render_template('login.html', error=f'Login error: {str(e)}')
    return render_template('login.html')

# Warden dashboard
@app.route('/warden')
def warden_dashboard():
    if 'user_id' not in session or session['role'] != 'warden':
        return redirect(url_for('login'))
    available_rooms = fetch_available_rooms()
    return render_template('warden_dashboard.html', available_rooms=available_rooms)

# Student dashboard
@app.route('/student')
def student_dashboard():
    if 'user_id' not in session or session['role'] != 'student':
        return redirect(url_for('login'))
    available_rooms = fetch_available_rooms()
    return render_template('student_dashboard.html', available_rooms=available_rooms)

# Logout
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# API: Get complaints (Warden)
@app.route('/api/complaints', methods=['GET'])
def get_complaints():
    if 'user_id' not in session or session['role'] != 'warden':
        return jsonify({'error': 'Unauthorized'}), 401
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT c.complaint_id, c.student_id, s.first_name, s.last_name, c.description, c.complaint_date, c.status FROM Complaints c JOIN Students s ON c.student_id = s.student_id')
    complaints = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(complaints)

# API: Update complaint status (Warden)
@app.route('/api/complaints/<int:complaint_id>', methods=['PUT'])
def update_complaint(complaint_id):
    if 'user_id' not in session or session['role'] != 'warden':
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json()
    status = data['status']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE Complaints SET status = %s WHERE complaint_id = %s', (status, complaint_id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Complaint status updated'})

# API: Mark attendance (Warden)
@app.route('/api/attendance', methods=['POST'])
def mark_attendance():
    if 'user_id' not in session or session['role'] != 'warden':
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json()
    student_id = data['student_id']
    date = data['date']
    status = data['status']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO Attendance (student_id, date, status) VALUES (%s, %s, %s)', (student_id, date, status))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Attendance marked'}), 201

# API: Get attendance (Student)
@app.route('/api/attendance', methods=['GET'])
def get_attendance():
    if 'user_id' not in session or session['role'] != 'student':
        return jsonify({'error': 'Unauthorized'}), 401
    student_id = session['student_id']
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT date, status FROM Attendance WHERE student_id = %s', (student_id,))
    attendance = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(attendance)

# API: Report absence (Student)
@app.route('/api/absence', methods=['POST'])
def report_absence():
    if 'user_id' not in session or session['role'] != 'student':
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json()
    student_id = session['student_id']
    date = data['date']
    reason = data['reason']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO AbsenceReports (student_id, date, reason) VALUES (%s, %s, %s)', (student_id, date, reason))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Absence reported'}), 201

# API: Request holiday (Student)
@app.route('/api/holiday', methods=['POST'])
def request_holiday():
    if 'user_id' not in session or session['role'] != 'student':
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json()
    student_id = session['student_id']
    start_date = data['start_date']
    end_date = data['end_date']
    reason = data['reason']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO HolidayRequests (student_id, start_date, end_date, reason) VALUES (%s, %s, %s, %s)', 
                   (student_id, start_date, end_date, reason))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Holiday request submitted'}), 201

# API: Available rooms (still needed for other potential uses)
@app.route('/api/rooms/available', methods=['GET'])
def get_available_rooms():
    return jsonify(fetch_available_rooms())

# API: Add student (Warden)
@app.route('/api/students', methods=['POST'])
def add_student():
    if 'user_id' not in session or session['role'] != 'warden':
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json()
    first_name = data['first_name']
    last_name = data['last_name']
    email = data['email']
    phone = data['phone']
    room_id = data['room_id']
    admission_date = data['admission_date']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        INSERT INTO Students (first_name, last_name, email, phone, room_id, admission_date)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (first_name, last_name, email, phone, room_id, admission_date))
    cursor.execute('UPDATE Rooms SET is_occupied = TRUE WHERE room_id = %s', (room_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Student added successfully'}), 201

# API: Get student
@app.route('/api/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT s.student_id, s.first_name, s.last_name, s.email, s.phone, r.room_number, h.hostel_name
        FROM Students s
        JOIN Rooms r ON s.room_id = r.room_id
        JOIN Hostel h ON r.hostel_id = h.hostel_id
        WHERE s.student_id = %s
    """
    cursor.execute(query, (student_id,))
    student = cursor.fetchone()
    cursor.close()
    conn.close()
    if student:
        return jsonify(student)
    return jsonify({'error': 'Student not found'}), 404

# API: Add complaint (Student)
@app.route('/api/complaints', methods=['POST'])
def add_complaint():
    if 'user_id' not in session or session['role'] != 'student':
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json()
    student_id = session['student_id']
    description = data['description']
    complaint_date = data['complaint_date']

    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        INSERT INTO Complaints (student_id, description, complaint_date, status)
        VALUES (%s, %s, %s, 'Open')
    """
    cursor.execute(query, (student_id, description, complaint_date))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Complaint logged successfully'}), 201

# Rules page
@app.route('/rules')
def rules():
    return render_template('rules.html')

if __name__ == '__main__':
    app.run(debug=True)
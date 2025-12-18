import mysql.connector
import bcrypt

db_config = {
    'user': 'root',
    'password': 'prathik',
    'host': 'localhost',
    'database': 'hostel_management'
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

def check_and_add_warden():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Check if warden exists
    cursor.execute('SELECT * FROM Users WHERE role = "warden"')
    warden = cursor.fetchone()
    
    if not warden:
        # Create a warden user
        email = 'warden@hostelhub.com'
        password = 'warden123'  # This will be hashed
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        cursor.execute('''
            INSERT INTO Users (email, password, role)
            VALUES (%s, %s, %s)
        ''', (email, hashed_password.decode('utf-8'), 'warden'))
        
        conn.commit()
        print("Warden user created successfully!")
        print("Email:", email)
        print("Password:", password)
    else:
        print("Warden user already exists:")
        print("Email:", warden['email'])
    
    cursor.close()
    conn.close()

if __name__ == '__main__':
    check_and_add_warden() 
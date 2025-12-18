import bcrypt

# Passwords to hash
passwords = ['warden123', 'student1233']

# Generate hashes
hashed_passwords = {}
for pwd in passwords:
    hashed = bcrypt.hashpw(pwd.encode('utf-8'), bcrypt.gensalt())
    hashed_passwords[pwd] = hashed.decode('utf-8')
    print(f"Password: {pwd}, Hash: {hashed.decode('utf-8')}")
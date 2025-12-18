import os

# Generate a 32-byte random key and convert to hexadecimal
secret_key = os.urandom(32).hex()
print(secret_key)
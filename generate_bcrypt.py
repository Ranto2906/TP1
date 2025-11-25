# Script Python pour générer des hash BCrypt valides
# Installer bcrypt: pip install bcrypt

import bcrypt

passwords = {
    "adminpass": "admin@univ.mg",
    "dirpass": "directeur@univ.mg",
    "jeanpass": "jean.rakoto@univ.mg",
    "mariepass": "marie.rasoa@univ.mg",
    "paulpass": "paul.rabe@univ.mg"
}

print("=== Hash BCrypt Générés ===\n")

for password, email in passwords.items():
    # Générer le hash BCrypt (salt automatique)
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=10))
    hash_str = hashed.decode('utf-8')
    
    print(f"Password: {password}")
    print(f"Email: {email}")
    print(f"BCrypt Hash: {hash_str}")
    print()

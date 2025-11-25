package mg.itu.notesapi;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateHashes {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        System.out.println("=== Génération des Hash BCrypt ===\n");
        
        String[] passwords = {"adminpass", "jeanpass", "mariepass", "paulpass", "dirpass"};
        String[] users = {"admin@univ.mg", "jean.rakoto@univ.mg", "marie.rasoa@univ.mg", "paul.rabe@univ.mg", "directeur@univ.mg"};
        
        for (int i = 0; i < passwords.length; i++) {
            String hash = encoder.encode(passwords[i]);
            System.out.println("Mot de passe: " + passwords[i]);
            System.out.println("Hash BCrypt: " + hash);
            System.out.println("User: " + users[i]);
            System.out.println();
        }
    }
}

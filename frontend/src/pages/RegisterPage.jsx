import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
    } else if (!role) {
      setMessage('Veuillez sélectionner un rôle.');
    } else {
      // Simuler une requête de création de compte
      setMessage(`Compte ${role} créé avec succès !`);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topRightMenu}>
        <Link to="/" style={styles.menuLink}>Accueil</Link>
        <Link to="/login" style={styles.menuLink}>Connexion</Link>
        <Link to="/register" style={styles.menuLink}>Créer un compte</Link>
        <Link to="/demo" style={styles.menuLink}>Demander une démo</Link>
        <Link to="/pricing" style={styles.menuLink}>Tarifs</Link>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Créer un compte</h2>
        <p style={styles.subtitle}>Rejoignez Scenography selon votre profil professionnel.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.input}
            required
          >
            <option value="">-- Sélectionner un rôle --</option>
            <option value="admin">Admin</option>
            <option value="agence">Agence</option>
            <option value="client">Client</option>
          </select>

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Créer un compte</button>
        </form>

        {message && (
          <p style={{ ...styles.message, color: message.includes('succès') ? '#22c55e' : '#ef4444' }}>
            {message}
          </p>
        )}

        <p style={styles.footerText}>
          Déjà un compte ? <Link to="/login" style={styles.link}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #0f172a, #1e293b)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Inter, sans-serif',
    padding: '2rem',
    position: 'relative',
  },
  topRightMenu: {
    position: 'absolute',
    top: '1.5rem',
    right: '2rem',
    display: 'flex',
    gap: '1.5rem',
  },
  menuLink: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '3rem',
    borderRadius: '1rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#475569',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.8rem 1rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  message: {
    marginTop: '1rem',
    fontWeight: '500',
  },
  footerText: {
    marginTop: '2rem',
    fontSize: '0.95rem',
    color: '#475569',
  },
  link: {
    color: '#3b82f6',
    fontWeight: '500',
    textDecoration: 'none',
  },
};

export default RegisterPage;

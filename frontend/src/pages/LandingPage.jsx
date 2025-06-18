import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div style={{ backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      {/* HEADER simple à droite */}
      <header style={{
        padding: '1.5rem 2rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'fixed',
        top: 0,
        right: 0,
        width: '100%',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <nav>
          <ul style={{
            listStyle: 'none',
            display: 'flex',
            gap: '1.5rem',
            margin: 0,
            padding: 0
          }}>
            <li><Link to="/" style={linkStyle}>Accueil</Link></li>
            <li><Link to="/login" style={linkStyle}>Connexion</Link></li>
            <li><Link to="/register" style={linkStyle}>Créer un compte</Link></li>
            <li><Link to="/demo" style={linkStyle}>Demander une démo</Link></li>
            <li><Link to="/pricing" style={linkStyle}>Tarifs</Link></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ paddingTop: '6rem', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* HERO */}
        <section style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>
            Créez vos décors scénographiques en toute simplicité
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Notre plateforme vous permet de modéliser, collaborer et exporter vos projets de scénographie visuellement et efficacement.
          </p>
          <button style={buttonStyle}>Voir une démo</button>
        </section>

        {/* Étapes */}
        <section style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '5rem' }}>
          {[
            { title: '1. Importez vos images', icon: '🖼️' },
            { title: '2. Ajoutez des éléments scéniques', icon: '🎭' },
            { title: '3. Collaborez et exportez', icon: '🚀' },
          ].map((step, index) => (
            <div key={index} style={cardStyle}>
              <div style={{ fontSize: '2.5rem' }}>{step.icon}</div>
              <h4 style={{ color: '#1e293b', fontSize: '1.2rem', marginTop: '1rem' }}>{step.title}</h4>
            </div>
          ))}
        </section>

        {/* Vidéo démo */}
        <section style={{ maxWidth: '800px', textAlign: 'center', marginBottom: '5rem' }}>
          <h3 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '1rem' }}>Regardez Scenography en action</h3>
          <div style={{
            backgroundColor: '#cbd5e1',
            height: '300px',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
            fontSize: '1.2rem'
          }}>
            [ Vidéo Démo Intégrée Ici ]
          </div>
        </section>

        {/* Témoignages */}
        <section style={{ maxWidth: '900px', marginBottom: '5rem' }}>
          <h3 style={{ fontSize: '2rem', textAlign: 'center', color: '#1e293b', marginBottom: '2rem' }}>Ce que disent nos utilisateurs</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
            {[
              { name: 'Julie M.', text: 'Une solution incroyable pour mes projets scénographiques !' },
              { name: 'Théo B.', text: 'Très intuitive et rapide à prendre en main.' },
              { name: 'Agence Lumière', text: 'Un vrai gain de temps et un rendu bluffant pour nos clients.' },
            ].map((testimonial, index) => (
              <div key={index} style={cardStyle}>
                <p style={{ fontStyle: 'italic', color: '#475569' }}>"{testimonial.text}"</p>
                <p style={{ fontWeight: 'bold', color: '#1e293b', marginTop: '1rem' }}>{testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const linkStyle = {
  color: '#1e293b',
  textDecoration: 'none',
  fontWeight: '500',
  fontSize: '1rem',
  transition: 'color 0.2s ease',
};

const buttonStyle = {
  backgroundColor: '#6366f1',
  color: '#fff',
  padding: '1rem 2rem',
  fontSize: '1rem',
  borderRadius: '0.5rem',
  fontWeight: '600',
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.3s ease'
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '2rem',
  borderRadius: '1rem',
  boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
  width: '250px',
  textAlign: 'center'
};

export default LandingPage;

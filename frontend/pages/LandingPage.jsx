import React from 'react';

function LandingPage() {
  return (
    <div style={{ textAlign: 'center', padding: '2.5rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#2563eb' }}>Bienvenue sur Scenography SaaS</h1>
      <p style={{ marginTop: '1rem', fontSize: '1.125rem' }}>
        Créez et gérez vos projets de scénographie facilement.
      </p>
      <div className="card" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
        <p>Découvrez nos fonctionnalités.</p>
        <button className="btn-primary" style={{ marginTop: '1rem' }}>Commencer</button>
      </div>
    </div>
  );
}

export default LandingPage;
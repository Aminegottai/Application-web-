import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({ client: '', date: '', eventType: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Exemple de projets
    setProjects([
      {
        _id: '1',
        titre: 'Lancement Produit',
        imageBase: 'https://source.unsplash.com/random/300x200?product',
        status: 'En cours',
      },
      {
        _id: '2',
        titre: 'Scénographie Gala',
        imageBase: 'https://source.unsplash.com/random/300x200?stage',
        status: 'Terminé',
      },
    ]);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleNewProject = () => {
    navigate('/create-project');
  };

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>🎭 Scenography</h2>
        <nav>
          <ul style={styles.navList}>
            <li style={styles.navItem}>Dashboard</li>
            <li style={styles.navItem}>Projets</li>
            <li style={styles.navItem}>Paramètres</li>
            <li style={{ ...styles.navItem, color: '#ef4444' }}>Déconnexion</li>
          </ul>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>Tableau de bord</h1>
          <button style={styles.newBtn} onClick={handleNewProject}>+ Nouveau projet</button>
        </div>

        {/* Filtres */}
        <div style={styles.filters}>
          <input
            name="client"
            placeholder="Client"
            value={filters.client}
            onChange={handleFilterChange}
            style={styles.input}
          />
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            style={styles.input}
          />
          <select
            name="eventType"
            value={filters.eventType}
            onChange={handleFilterChange}
            style={styles.input}
          >
            <option value="">Type d’événement</option>
            <option value="concert">Concert</option>
            <option value="conférence">Conférence</option>
          </select>
        </div>

        {/* Projets */}
        <div style={styles.grid}>
          {projects.map((p) => (
            <div key={p._id} style={styles.card}>
              <img src={p.imageBase} alt={p.titre} style={styles.image} />
              <h3 style={styles.cardTitle}>{p.titre}</h3>
              <span
                style={{
                  ...styles.status,
                  backgroundColor: p.status === 'Terminé' ? '#10b981' : '#facc15',
                }}
              >
                {p.status}
              </span>
              <div style={styles.actions}>
                <button style={styles.actionBtn}>Voir</button>
                <button style={styles.actionBtn}>Modifier</button>
                <button style={{ ...styles.actionBtn, backgroundColor: '#ef4444' }}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ✅ Styles inline
const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'Segoe UI, sans-serif',
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#1e293b',
    color: 'white',
    padding: '2rem 1.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
  },
  logo: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    fontWeight: 'bold',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
  },
  navItem: {
    padding: '0.75rem 0',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  main: {
    flex: 1,
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  newBtn: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  input: {
    padding: '0.6rem 1rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    minWidth: '180px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    padding: '1rem',
    textAlign: 'center',
    transition: 'transform 0.2s ease',
  },
  image: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.2rem',
    color: '#1e293b',
    marginBottom: '0.5rem',
  },
  status: {
    padding: '0.3rem 0.8rem',
    borderRadius: '1rem',
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    display: 'inline-block',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  actionBtn: {
    padding: '0.4rem 0.8rem',
    fontSize: '0.85rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.3rem',
    cursor: 'pointer',
  },
};

export default DashboardPage;
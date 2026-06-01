import { Link } from 'react-router-dom';
import logolight from '../assets/logolight.png';

export default function Homepage() {
  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      minHeight: '100vh',
      background: '#EAF3FB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      {/* Background circles */}
      <div style={{
        position: 'absolute', width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #B5D4F4 0%, transparent 70%)',
        top: -120, right: -100, opacity: 0.5, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 360, height: 360,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #85B7EB 0%, transparent 70%)',
        bottom: -80, left: -80, opacity: 0.35, pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 8px 40px rgba(24, 95, 165, 0.10)',
        width: '100%',
        maxWidth: 800,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both',
      }}>

        {/* Card Top */}
        
        <div style={{
          background: 'linear-gradient(135deg, #185FA5 0%, #378ADD 100%)',
          padding: '7rem 2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 15,
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}>
          <img src={logolight} alt="L'Agora logo" style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 120, height: 'auto', pointerEvents: 'none', zIndex: 2 }} />
          {/* Decorative circle inside header */}
          <div style={{
            position: 'absolute', width: 280, height: 280,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            bottom: -100, right: -60,
            pointerEvents: 'none',
          }} />

          {/* <span style={{
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '5px 12px',
            borderRadius: 100,
            border: '1px solid rgba(255,255,255,0.25)',
          }}>
            Community Platform
          </span> */}

          <h1 style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: '2rem',
            fontWeight: 700,
            color: '#fff',
            margin: 0,
            lineHeight: 1.2,
            maxWidth: 700,
          }}>
            Welcome to L'Agora
          </h1>

          <p style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.75)',
            margin: 0,
            lineHeight: 1.6,
            maxWidth: 500,
          }}>
            A space to share ideas, spark conversations, and connect with people who think like you.
          </p>

          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {[true, false, false].map((active, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: active ? '#fff' : 'rgba(255,255,255,0.3)',
              }} />
            ))}
          </div>
        </div>

        {/* Card Body */}
        <div style={{
          padding: '2rem 2.5rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>

          {/* Feature grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}>
            {[
              { icon: 'ti-message-circle', label: 'Open discussions' },
              { icon: 'ti-users',          label: 'Vibrant community' },
              { icon: 'ti-bulb',           label: 'Share ideas freely' },
              { icon: 'ti-shield-check',   label: 'Safe & trusted space' },
            ].map(({ icon, label }) => (
              <div key={label} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: 12,
                background: '#EAF3FB',
                borderRadius: 12,
              }}>
                <div style={{
                  width: 32, height: 32,
                  borderRadius: 8,
                  background: '#185FA5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  color: '#fff',
                  fontSize: 15,
                }}>
                  <i className={`ti ${icon}`} aria-hidden="true" />
                </div>
                <div style={{
                  fontSize: 12,
                  color: '#0C447C',
                  fontWeight: 500,
                  lineHeight: 1.4,
                  paddingTop: 6,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#E6F1FB' }} />

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <Link to="/login" style={{
              display: 'block',
              width: '150px',
              padding: '14px',
              background: '#185FA5',
              color: '#fff',
              fontSize: 15,
              fontWeight: 500,
              border: 'none',
              borderRadius: 12,
              textAlign: 'center',
              textDecoration: 'none',
              boxSizing: 'border-box',
              transition: 'background 0.18s',
              marginLeft: '200px',
             
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#0C447C'}
              onMouseLeave={e => e.currentTarget.style.background = '#185FA5'}
            >
              Login
            </Link>

            <Link to="/register" style={{
              display: 'block',
              width: '150px',
              padding: '13px',
              background: 'transparent',
              color: '#185FA5',
              fontSize: 15,
              fontWeight: 500,
              border: '1.5px solid #378ADD',
              borderRadius: 12,
              textAlign: 'center',
              textDecoration: 'none',
              boxSizing: 'border-box',
              transition: 'background 0.18s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#EAF3FB'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Create account
            </Link>
          </div>

          {/* Footer note */}
          <p style={{ fontSize: 12, color: '#888780', textAlign: 'center', margin: 0 }}>
            By joining, you agree to our{' '}
            <a href="#" style={{ color: '#185FA5', textDecoration: 'none', fontWeight: 500 }}>Terms</a>
            {' '}and{' '}
            <a href="#" style={{ color: '#185FA5', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
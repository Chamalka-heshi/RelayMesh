import React, { useState } from 'react';
import { Shield, AlertTriangle, Radio, Lock, User, ChevronRight, Activity } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('dispatcher@relaymesh.org');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    {
      role: 'Emergency Dispatch Officer',
      name: 'Ananya Perera',
      email: 'dispatcher@relaymesh.org',
      password: 'password123',
      division: 'Central Command - Western Province Unit',
      badge: 'DP-3120',
      color: '#3b82f6'
    },
    {
      role: 'Central Division Director',
      name: 'Cmdr. Sarath Wickramasinghe',
      email: 'admin@relaymesh.org',
      password: 'password123',
      division: 'National Disaster Management Center (NDMC)',
      badge: 'DM-9041',
      color: '#ef4444'
    },
    {
      role: 'Search & Rescue Coordinator',
      name: 'Capt. Dinesh Fernando',
      email: 'sar.lead@relaymesh.org',
      password: 'password123',
      division: 'Rapid Response Division',
      badge: 'SR-7714',
      color: '#10b981'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('relaymesh_auth_token', data.token);
        localStorage.setItem('relaymesh_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      const matched = demoAccounts.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (matched && password === 'password123') {
        const dummyUser = {
          id: 'ADM-002',
          name: matched.name,
          email: matched.email,
          role: matched.role,
          division: matched.division,
          badgeNumber: matched.badge
        };
        localStorage.setItem('relaymesh_auth_token', 'offline-token');
        localStorage.setItem('relaymesh_user', JSON.stringify(dummyUser));
        onLoginSuccess(dummyUser);
      } else {
        setError('Cannot connect to Central Division server. Please ensure backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="donezo-login-wrapper">
      <div className="donezo-login-card">
        <div className="donezo-login-header">
          <div className="donezo-login-badge-icon">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <span className="donezo-login-division-tag">
              <Radio className="w-3.5 h-3.5" />
              Central Emergency Division
            </span>
            <h1 className="donezo-login-title">
              RelayMesh Command Hub
            </h1>
            <p className="donezo-login-subtitle">
              Central Disaster Response & Volunteer Dispatch Portal
            </p>
          </div>
        </div>

        {error && (
          <div className="donezo-login-error">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="donezo-login-form">
          <div className="donezo-form-group">
            <label className="donezo-form-label">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Central Operator Email / Badge ID
            </label>
            <input
              type="email"
              className="donezo-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@relaymesh.org"
              required
            />
          </div>

          <div className="donezo-form-group">
            <label className="donezo-form-label">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Central Division Security Passcode
            </label>
            <input
              type="password"
              className="donezo-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="donezo-login-submit-btn"
          >
            {loading ? (
              <>
                <Activity className="w-4 h-4 animate-spin" />
                <span>Authenticating Central Clearance...</span>
              </>
            ) : (
              <>
                <span>Authorize & Enter Dispatch Console</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="donezo-demo-section">
          <span className="donezo-demo-divider-text">
            One-Click Operator Clearance (Demo)
          </span>

          <div className="donezo-demo-list">
            {demoAccounts.map((acc, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectDemo(acc)}
                className={`donezo-demo-item ${email === acc.email ? 'active' : ''}`}
              >
                <div>
                  <span className="donezo-demo-item-name">{acc.name}</span>
                  <div className="donezo-demo-item-meta">
                    <span
                      className="donezo-chip-id"
                      style={{
                        backgroundColor: acc.color + '15',
                        color: acc.color,
                        borderColor: acc.color + '40',
                        fontSize: '0.68rem',
                        padding: '0.1rem 0.45rem',
                      }}
                    >
                      {acc.role}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">• {acc.badge}</span>
                  </div>
                </div>
                <span className="donezo-demo-select-btn">Select</span>
              </button>
            ))}
          </div>
        </div>

        <div className="donezo-login-footer">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>End-to-End Encrypted Disaster Mesh Channel • Central Division Node #01</span>
        </div>
      </div>
    </div>
  );
}

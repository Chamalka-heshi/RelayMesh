import axios from 'axios';
import mockDataStore from './mockDataStore';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 4000
});

// Attach auth token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('relaymesh_auth_token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

export const api = {
  // Auth
  login: async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('relaymesh_auth_token', res.data.token);
        localStorage.setItem('relaymesh_user', JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (e) {
      // Prototype Auth clearance fallback
      const mockUser = {
        name: email.includes('admin') ? 'Cmdr. Sarath Wickramasinghe' : 'Operator Ananya Perera',
        email,
        role: email.includes('admin') ? 'Central Division Director' : 'Emergency Dispatch Officer',
        badge: email.includes('admin') ? 'DM-9041' : 'DP-3120',
        division: 'Western Province Emergency Operations Centre'
      };
      localStorage.setItem('relaymesh_auth_token', 'mock_token_demo_' + Date.now());
      localStorage.setItem('relaymesh_user', JSON.stringify(mockUser));
      return { success: true, token: 'mock_token_demo', user: mockUser };
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('relaymesh_auth_token');
    localStorage.removeItem('relaymesh_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('relaymesh_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Health
  getHealth: async () => {
    try {
      const res = await apiClient.get('/health');
      return res.data;
    } catch (e) {
      return { status: 'ONLINE', mode: 'CLIENT_PROTOTYPE', latencyMs: 14 };
    }
  },

  // Dashboard Overview
  getDashboardOverview: async () => {
    try {
      const res = await apiClient.get('/dashboard/overview');
      return res.data;
    } catch (e) {
      const state = mockDataStore.getState();
      return {
        success: true,
        data: {
          metrics: state.metrics,
          incidents: state.incidents,
          networkHealth: {
            status: 'ONLINE',
            onlineNodes: state.metrics.activeNodes,
            offlineNodes: 19,
            totalNodes: 203,
            availabilityPct: 91,
            coveragePct: 94,
            messagesHourly: 1420,
            lastSync: '4 sec ago'
          },
          activities: state.auditLogs,
          mapData: {
            alerts: state.sosAlerts.filter(s => s.status === 'ACTIVE' || s.status === 'DISPATCHED'),
            volunteers: state.volunteers,
            resources: state.resources,
            nodes: [
              { id: 'RM-84F2', type: 'GATEWAY', status: 'ONLINE', latitude: 6.9450, longitude: 79.8750, messagesHandled: 482, battery: 100 },
              { id: 'RM-21A4', type: 'RELAY_ROUTER', status: 'ONLINE', latitude: 6.9501, longitude: 79.8710, messagesHandled: 236, battery: 91 },
              { id: 'RM-91C2', type: 'MOBILE_NODE', status: 'ONLINE', latitude: 6.9380, longitude: 79.8730, messagesHandled: 114, battery: 84 },
              { id: 'RM-4412', type: 'RELAY_ROUTER', status: 'ONLINE', latitude: 6.9150, longitude: 79.8820, messagesHandled: 198, battery: 78 },
              { id: 'RM-6721', type: 'SOLAR_TOWER', status: 'ONLINE', latitude: 6.9200, longitude: 79.8600, messagesHandled: 520, battery: 95 }
            ]
          }
        }
      };
    }
  },

  // Incidents
  getIncidents: async () => {
    try {
      const res = await apiClient.get('/incidents');
      return res.data;
    } catch (e) {
      return { success: true, data: mockDataStore.getState().incidents };
    }
  },

  // Resources
  getResources: async () => {
    try {
      const res = await apiClient.get('/resources');
      return res.data;
    } catch (e) {
      return { success: true, data: mockDataStore.getState().resources };
    }
  },

  addResource: async (newRes) => {
    try {
      const res = await apiClient.post('/resources', newRes);
      return res.data;
    } catch (e) {
      const created = mockDataStore.addResource(newRes);
      return { success: true, data: created };
    }
  },

  allocateResource: async (resourceId, amount, targetSector) => {
    try {
      const res = await apiClient.post(`/resources/${resourceId}/allocate`, { amount, targetSector });
      return res.data;
    } catch (e) {
      const ok = mockDataStore.allocateResource(resourceId, amount, targetSector);
      return { success: ok };
    }
  },

  // SOS Alerts
  getSOSAlerts: async (status = 'ALL', priority = null) => {
    try {
      const params = {};
      if (status && status !== 'ALL') params.status = status;
      if (priority) params.priority = priority;
      const res = await apiClient.get('/sos', { params });
      return res.data;
    } catch (e) {
      let alerts = mockDataStore.getState().sosAlerts;
      if (status && status !== 'ALL') {
        alerts = alerts.filter(a => a.status === status);
      }
      if (priority) {
        alerts = alerts.filter(a => a.priority === priority);
      }
      return { success: true, data: alerts };
    }
  },

  resolveSOS: async (id) => {
    try {
      const res = await apiClient.post(`/sos/${id}/resolve`);
      return res.data;
    } catch (e) {
      mockDataStore.resolveSOS(id);
      return { success: true };
    }
  },

  // Volunteers
  getVolunteers: async (status = 'ALL') => {
    try {
      const params = {};
      if (status && status !== 'ALL') params.status = status;
      const res = await apiClient.get('/volunteers', { params });
      return res.data;
    } catch (e) {
      let list = mockDataStore.getState().volunteers;
      if (status && status !== 'ALL') {
        list = list.filter(v => v.status === status);
      }
      return { success: true, data: list };
    }
  },

  // Dispatch Assignments
  getDispatchAssignments: async () => {
    try {
      const res = await apiClient.get('/dispatch');
      return res.data;
    } catch (e) {
      return { success: true, data: mockDataStore.getState().dispatchAssignments };
    }
  },

  dispatchVolunteer: async (sosId, volunteerId, instructions) => {
    try {
      const res = await apiClient.post('/dispatch', { sosId, volunteerId, instructions });
      return res.data;
    } catch (e) {
      const assignment = mockDataStore.dispatchUnit(sosId, volunteerId, instructions);
      return { success: true, data: assignment };
    }
  },

  // Activity / Audit Logs
  getActivityLog: async () => {
    try {
      const res = await apiClient.get('/activity');
      return res.data;
    } catch (e) {
      return { success: true, data: mockDataStore.getState().auditLogs };
    }
  },

  // System Reset
  resetScenario: async () => {
    try {
      const res = await apiClient.post('/system/reset-scenario');
      return res.data;
    } catch (e) {
      mockDataStore.resetToInitial();
      return { success: true };
    }
  }
};

export default api;

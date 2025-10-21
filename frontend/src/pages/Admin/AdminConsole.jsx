import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import './admin.css';

export default function AdminConsole() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [authStatus, setAuthStatus] = useState(null); // null | 'ok' | 'fail'
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [showToken, setShowToken] = useState(false);
  const [lastRequests, setLastRequests] = useState([]);
  const [viewUser, setViewUser] = useState(null);
  const API_BASE = '/api/v1';

  useEffect(() => {
    try {
      // If jQuery failed to import for any reason, surface an error instead of crashing
      if (typeof $ === 'undefined') {
        setError('jQuery is not available. Make sure jquery is installed and imported correctly.');
        return;
      }
      // verify admin before loading data
      verifyAdmin().then((ok) => {
        if (ok) {
          loadUsers();
          loadGroups();
        }
      }).catch((e) => setError('Auth check failed: ' + (e && e.message ? e.message : String(e))));
    } catch (e) {
      setError('AdminConsole init error: ' + (e && e.message ? e.message : String(e)));
    }
  }, []);

  async function verifyAdmin() {
    setError(null);
    if (!token) {
      setError('No token provided. Please paste an admin token and click Save.');
      return false;
    }
    try {
      // call auth/me using doAjax wrapper to capture xhr/status
      const primaryUrl = API_BASE + '/auth/me';
      try {
        const { res, xhr } = await doAjax('GET', primaryUrl);
        pushRequest('auth-primary', primaryUrl, xhr && xhr.status, res);
        const isHtmlResponse = typeof res === 'string' && res.trim().startsWith('<');
        var user = res && (res.user || res);
        if (isHtmlResponse || !user) {
          // Try direct backend (port 3000) in case Vite dev server is serving index.html
          console.warn('verifyAdmin: primary returned HTML or no user, attempting direct backend');
          try {
            const { res: directRes, xhr: xhr2 } = await doAjax('GET', 'http://localhost:3000/api/v1/auth/me');
            pushRequest('auth-direct', 'http://localhost:3000/api/v1/auth/me', xhr2 && xhr2.status, directRes);
            user = directRes && (directRes.user || directRes);
          } catch (dErr) {
            console.error('verifyAdmin direct attempt failed', dErr);
            pushRequest('auth-direct-failed', 'http://localhost:3000/api/v1/auth/me', dErr && dErr.status, dErr && (dErr.responseText || dErr.statusText));
          }
        }
      } catch (pErr) {
        console.error('verifyAdmin primary failed', pErr);
        pushRequest('auth-primary-failed', primaryUrl, pErr && pErr.status, pErr && (pErr.responseText || pErr.statusText));
      }
      if (!user) {
        setError('Auth check: unexpected response');
        setAuthStatus('fail');
        setCurrentAdmin(null);
        return false;
      }
      setAuthStatus('ok');
      console.log('verifyAdmin: current user:', user);
      setCurrentAdmin(user.username || user._id || null);
      if (!user.isAdmin) {
        setError('Current user is not an admin. Access denied.');
        setCurrentAdmin(null);
        return false;
      }
      return true;
    } catch (err) {
      console.error('verifyAdmin error', err);
      setAuthStatus('fail');
      setCurrentAdmin(null);
      setError('Auth verification failed: ' + (err && err.responseText ? err.responseText : (err && err.message ? err.message : String(err))));
      return false;
    }
  }

  function ajaxOptions(method, url, data) {
    return {
      url: url,
      method: method,
      data: data ? JSON.stringify(data) : undefined,
      contentType: 'application/json',
      beforeSend(xhr) {
        if (token) xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    };
  }

  function pushRequest(name, url, status, body) {
    setLastRequests(prev => [{ name, url, status, body: typeof body === 'string' ? body : JSON.stringify(body).slice(0, 1000) }, ...prev].slice(0, 10));
  }

  function doAjax(method, url, data) {
    return new Promise((resolve, reject) => {
      try {
        const jq = $.ajax(ajaxOptions(method, url, data));
        if (jq && jq.done) {
          jq.done((res, textStatus, xhr) => resolve({ res, xhr }));
          jq.fail((xhr) => reject(xhr));
        } else {
          Promise.resolve(jq).then((res) => resolve({ res, xhr: null })).catch((err) => reject(err));
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  async function loadUsers() {
    setError(null);
    setLoadingUsers(true);
    try {
      const endpoint = API_BASE + '/users/all';
      console.log('Loading users from', endpoint);
      try {
        const { res, xhr } = await doAjax('GET', endpoint);
        pushRequest('users-primary', endpoint, xhr && xhr.status, res);
        setUsers(res.data || res);
        console.log('users (primary response):', res.data || res);
        setAuthStatus('ok');
      } catch (err) {
        console.error('Users load failed (primary):', err);
        setAuthStatus('fail');
        pushRequest('users-primary-failed', endpoint, err && err.status, err && (err.responseText || err.statusText));
        // Try direct backend (common dev setup where proxy isn't configured)
        try {
          const direct = 'http://localhost:3000/api/v1/users/all';
          const { res: r2, xhr: xhr2 } = await doAjax('GET', direct);
          pushRequest('users-direct', direct, xhr2 && xhr2.status, r2);
          setUsers(r2.data || r2);
          console.log('users (direct response):', r2.data || r2);
          setAuthStatus('ok');
          setError(null);
        } catch (dErr) {
          console.error('Users load failed (direct):', dErr);
          pushRequest('users-direct-failed', 'http://localhost:3000/api/v1/users/all', dErr && dErr.status, dErr && (dErr.responseText || dErr.statusText));
          const msg1 = err && (err.responseText || err.statusText) || 'primary request failed';
          const msg2 = dErr && (dErr.responseText || dErr.statusText) || 'direct request failed';
          setError(`Failed to load users.\nPrimary: ${msg1}\nDirect: ${msg2}\nCheck backend is running, CORS/proxy settings, and that token is valid.`);
        }
      } finally {
        setLoadingUsers(false);
      }
    } catch (e) {
      setError('Failed to load users: ' + (e && e.message ? e.message : String(e)));
      setLoadingUsers(false);
    }
  }

  async function loadGroups() {
    setError(null);
    setLoadingGroups(true);
    try {
      const endpoint = API_BASE + '/groups';
      try {
        const { res, xhr } = await doAjax('GET', endpoint);
        pushRequest('groups-primary', endpoint, xhr && xhr.status, res);
        setGroups(res.data || res);
      } catch (err) {
        console.error('Groups load failed (primary):', err);
        pushRequest('groups-primary-failed', endpoint, err && err.status, err && (err.responseText || err.statusText));
        // try direct backend on port 3000
        try {
          const direct = 'http://localhost:3000/api/v1/groups';
          const { res: r2, xhr: xhr2 } = await doAjax('GET', direct);
          pushRequest('groups-direct', direct, xhr2 && xhr2.status, r2);
          setGroups(r2.data || r2);
          setError(null);
        } catch (dErr) {
          console.error('Groups load failed (direct):', dErr);
          pushRequest('groups-direct-failed', 'http://localhost:3000/api/v1/groups', dErr && dErr.status, dErr && (dErr.responseText || dErr.statusText));
          const msg1 = err && (err.responseText || err.statusText) || 'primary request failed';
          const msg2 = dErr && (dErr.responseText || dErr.statusText) || 'direct request failed';
          setError(`Failed to load groups.\nPrimary: ${msg1}\nDirect: ${msg2}`);
        }
      } finally {
        setLoadingGroups(false);
      }
    } catch (e) {
      setError('Failed to load groups: ' + (e && e.message ? e.message : String(e)));
      setLoadingGroups(false);
    }
  }

  // log users state updates for debugging
  React.useEffect(() => {
    console.log('users state updated (useEffect):', users);
  }, [users]);

  function deleteUser(id) {
    if (!confirm('Delete user?')) return;
    setError(null);
    try {
      const jq = $.ajax(ajaxOptions('DELETE', API_BASE + '/users/' + id));
      if (jq && jq.done) {
        jq.done(() => { loadUsers(); }).fail((xhr) => setError('Delete failed: ' + (xhr.responseText || xhr.statusText)));
      } else {
        Promise.resolve(jq).then(() => loadUsers()).catch((err) => setError('Delete failed: ' + String(err)));
      }
    } catch (e) {
      setError('Delete failed: ' + (e && e.message ? e.message : String(e)));
    }
  }

  return (
    <div className="admin-console">
      <h2>Admin Console (jQuery AJAX)</h2>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Token input intentionally hidden from the UI to avoid exposing secrets. Use browser DevTools or the Save/Clear buttons to manage the token in localStorage. */}
        </div>

        <div style={{ marginTop: 8, fontSize: '0.9rem', color: '#333', display: 'flex', alignItems: 'center', gap: 8 }}>
          {currentAdmin && <span style={{ fontSize: '0.95rem', color: '#222' }}>Verified admin: <strong>{currentAdmin}</strong></span>}
          <span title={authStatus === 'ok' ? 'Authenticated' : authStatus === 'fail' ? 'Auth failed' : 'Unknown'}>
            {authStatus === 'ok' ? (
              <span style={{ display: 'inline-block', width: 10, height: 10, background: '#3bbf6f', borderRadius: 10 }} />
            ) : authStatus === 'fail' ? (
              <span style={{ display: 'inline-block', width: 10, height: 10, background: '#e84a4a', borderRadius: 10 }} />
            ) : (
              <span style={{ display: 'inline-block', width: 10, height: 10, background: '#ccc', borderRadius: 10 }} />
            )}
          </span>
        </div>
      </div>

      <section>
        <h3>Users</h3>
        <button onClick={loadUsers}>Reload</button>
        {loadingUsers && <span style={{ marginLeft: 8 }}>Loading users...</span>}
        <table className="admin-table">
          <thead><tr><th>Username</th><th>Email</th><th>First</th><th>Last</th><th>Actions</th></tr></thead>
          <tbody>
            {Array.isArray(users) ? users.map(u => (
              <tr key={u._id || u.id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.firstName}</td>
                <td>{u.lastName}</td>
                <td>
                  <button style={{ marginRight: 8 }} onClick={() => setViewUser(u)}>View</button>
                  <button className="btn-danger" onClick={() => deleteUser(u._id || u.id)}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} style={{ color: '#666' }}>No users or unexpected response format</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Groups</h3>
        <button onClick={loadGroups}>Reload</button>
        {loadingGroups && <span style={{ marginLeft: 8 }}>Loading groups...</span>}
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Privacy</th><th>Members</th></tr></thead>
          <tbody>
            {Array.isArray(groups) ? groups.map(g => (
              <tr key={g._id || g.id}>
                <td>{g.name}</td>
                <td>{g.privacy}</td>
                <td>{(g.members && g.members.length) || 0}</td>
              </tr>
            )) : (
              <tr><td colSpan={3} style={{ color: '#666' }}>No groups or unexpected response format</td></tr>
            )}
          </tbody>
        </table>
      </section>
      {error && (
        <div style={{ marginTop: 16, padding: 12, background: '#ffecec', color: '#a33', borderRadius: 8 }}>
          <strong>Error:</strong> {error}
          <div style={{ marginTop: 8, fontSize: '0.9rem', color: '#333' }}>Also check the browser console (F12) and Network tab for details.</div>
        </div>
      )}
      {viewUser && (
        <div style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setViewUser(null)}>
          <div style={{ background: '#fff', padding: 20, borderRadius: 8, minWidth: 400, maxWidth: '90%', maxHeight: '80%', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <h3>User details: {viewUser.username || viewUser._id}</h3>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ width: 120, flex: '0 0 120px', textAlign: 'center' }}>
                {/* Avatar: check common fields and fall back to placeholder */}
                <img alt={viewUser.username || 'avatar'} src={viewUser.profilePicture || viewUser.profilePic || viewUser.avatar || viewUser.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg'} style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
              </div>
              <div style={{ minWidth: 300, flex: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr><td style={{ padding: 6, fontWeight: 600 }}>Username</td><td style={{ padding: 6 }}>{viewUser.username}</td></tr>
                    <tr><td style={{ padding: 6, fontWeight: 600 }}>Email</td><td style={{ padding: 6 }}>{viewUser.email}</td></tr>
                    <tr><td style={{ padding: 6, fontWeight: 600 }}>First</td><td style={{ padding: 6 }}>{viewUser.firstName}</td></tr>
                    <tr><td style={{ padding: 6, fontWeight: 600 }}>Last</td><td style={{ padding: 6 }}>{viewUser.lastName}</td></tr>
                    <tr><td style={{ padding: 6, fontWeight: 600 }}>Admin</td><td style={{ padding: 6 }}>{viewUser.isAdmin ? 'Yes' : 'No'}</td></tr>
                    <tr><td style={{ padding: 6, fontWeight: 600 }}>Joined</td><td style={{ padding: 6 }}>{viewUser.createdAt ? new Date(viewUser.createdAt).toLocaleString() : '-'}</td></tr>
                    <tr><td style={{ padding: 6, fontWeight: 600 }}>Bio</td><td style={{ padding: 6 }}>{viewUser.bio || '-'}</td></tr>
                  </tbody>
                </table>
              </div>
              <div style={{ minWidth: 300, flex: 1 }}>
                <details style={{ background: '#f7f7f7', padding: 10, borderRadius: 6 }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Raw JSON (expand)</summary>
                  <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', marginTop: 8, maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(viewUser, null, 2)}</pre>
                </details>
              </div>
            </div>
            <div style={{ textAlign: 'right', marginTop: 12 }}>
              <button onClick={() => setViewUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

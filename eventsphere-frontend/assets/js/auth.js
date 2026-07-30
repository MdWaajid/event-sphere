/* ============================================================
   EventSphere — Auth / Session Management
   ============================================================ */

const Auth = {
  /**
   * Resolve a root-relative path to work from the current page's location.
   * Works on both file:// (Windows/Mac) and http:// protocols.
   * Detects depth by looking for known folder names in the URL.
   */
  _rel(path) {
    if (path.startsWith('.')) return path; // Already relative, don't modify it
    const href = window.location.href.replace(/\\/g, '/');
    let depth = 0;
    if (href.includes('/pages/admin/')) depth = 2;
    else if (href.includes('/pages/'))  depth = 1;
    else depth = 0;
    const prefix = depth > 0 ? '../'.repeat(depth) : '';
    // path is root-relative like '/index.html' or '/pages/login.html'
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return prefix + cleanPath;
  },

  /** Get current session user */
  getUser() {
    return API.getMe();
  },

  /** Check if logged in */
  isLoggedIn() {
    return !!storage.get('session');
  },

  /** Check if current user is admin */
  isAdmin() {
    const s = storage.get('session');
    return s && s.role === 'ADMIN';
  },

  /** Redirect to login if not logged in */
  requireLogin(redirectUrl) {
    if (!this.isLoggedIn()) {
      window.location.href = this._rel(redirectUrl || '/pages/login.html');
      return false;
    }
    return true;
  },

  /** Redirect to login if not admin */
  requireAdmin(redirectUrl) {
    if (!this.isLoggedIn()) {
      window.location.href = this._rel(redirectUrl || '/pages/login.html');
      return false;
    }
    if (!this.isAdmin()) {
      window.location.href = this._rel(redirectUrl || '/index.html');
      return false;
    }
    return true;
  },

  /** Redirect away if already logged in */
  redirectIfLoggedIn(to) {
    if (this.isLoggedIn()) {
      const user = storage.get('session');
      if (user && user.role === 'ADMIN') {
        window.location.href = this._rel(to || '/pages/admin/dashboard.html');
      } else {
        window.location.href = this._rel(to || '/index.html');
      }
      return true;
    }
    return false;
  },

  /** Logout and redirect (always redirects, even if the server call fails/times out) */
  async logout(redirectUrl) {
    try {
      await API.logout();
    } catch (err) {
      console.error('Logout request failed, clearing session locally:', err);
    } finally {
      storage.del('session');
      window.location.href = this._rel(redirectUrl || '/index.html');
    }
  },

  /** Update all nav user state */
  updateNav() {
    const user = storage.get('session');
    const loginBtn    = document.getElementById('nav-login-btn');
    const registerBtn = document.getElementById('nav-register-btn');
    const userMenu    = document.getElementById('nav-user-menu');
    const userNameEl  = document.getElementById('nav-user-name');
    const adminLink   = document.getElementById('nav-admin-link');
    const myRegsLink  = document.querySelector('ul.nav-links a[href*="my-registrations.html"]');

    if (user) {
      if (loginBtn)    { loginBtn.classList.add('hidden'); loginBtn.style.display = 'none'; }
      if (registerBtn) { registerBtn.classList.add('hidden'); registerBtn.style.display = 'none'; }
      if (userMenu)    { userMenu.classList.remove('hidden'); userMenu.style.display = 'flex'; }
      if (userNameEl)  userNameEl.textContent = user.fullName.split(' ')[0];
      if (myRegsLink)  { myRegsLink.parentElement.style.display = ''; }
      if (adminLink) {
        if (user.role === 'ADMIN') { adminLink.classList.remove('hidden'); adminLink.style.display = ''; }
        else { adminLink.classList.add('hidden'); adminLink.style.display = 'none'; }
      }
    } else {
      if (loginBtn)    { loginBtn.classList.remove('hidden'); loginBtn.style.display = ''; }
      if (registerBtn) { registerBtn.classList.remove('hidden'); registerBtn.style.display = ''; }
      if (userMenu)    { userMenu.classList.add('hidden'); userMenu.style.display = 'none'; }
      if (myRegsLink)  { myRegsLink.parentElement.style.display = 'none'; }
    }
  },

  /** Update admin sidebar user info */
  updateSidebar() {
    const user = storage.get('session');
    if (!user) return;
    const nameEl = document.getElementById('sidebar-user-name');
    const roleEl = document.getElementById('sidebar-user-role');
    const avaEl  = document.getElementById('sidebar-avatar');
    if (nameEl) nameEl.textContent = user.fullName;
    if (roleEl) roleEl.textContent = user.role;
    if (avaEl)  avaEl.textContent  = user.fullName.charAt(0).toUpperCase();
  }
};

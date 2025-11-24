// Implementação de autenticação mais segura usando JWT
class Auth {
  constructor() {
    this.tokenKey = 'auth_token';
    this.users = [
      { 
        id: 1, 
        username: "admin", 
        // Em produção, isso seria um hash armazenado no banco de dados
        password: "123", 
        name: "Administrador" 
      }
    ];
  }

  // Gerar um token JWT simples
  generateToken(user) {
    // Simplificação de JWT para demonstração
    // Em produção, usaria uma biblioteca como jsonwebtoken
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      username: user.username,
      name: user.name,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    }));
    const signature = btoa(`${header}.${payload}`); // Simplificado, em produção usaria HMAC-SHA256
    return `${header}.${payload}.${signature}`;
  }

  // Verificar se o token é válido
  verifyToken(token) {
    if (!token) return false;
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      const payload = JSON.parse(atob(parts[1]));
      if (!payload || !payload.exp) return false;
      
      // Verificar se o token expirou
      if (payload.exp < Date.now()) {
        this.logout();
        return false;
      }
      
      return payload;
    } catch (e) {
      console.error('Erro ao verificar token:', e);
      return false;
    }
  }

  // Login do usuário
  login(username, password) {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (!user) return false;
    
    const token = this.generateToken(user);
    localStorage.setItem(this.tokenKey, token);
    return true;
  }

  // Logout do usuário
  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  // Verificar se o usuário está autenticado
  isAuthenticated() {
    const token = localStorage.getItem(this.tokenKey);
    return this.verifyToken(token) !== false;
  }

  // Obter dados do usuário atual
  getCurrentUser() {
    const token = localStorage.getItem(this.tokenKey);
    return this.verifyToken(token);
  }
}

// Instância global de autenticação
const auth = new Auth();

import React from 'react';

export default function LoginPage() {
  return (
    <div style={{maxWidth: 420, margin: '56px auto', padding: 24}}>
      <h1>Consultant Login</h1>
      <form>
        <div style={{margin: '12px 0'}}>
          <label>Email</label><br/>
          <input type="email" name="email" required />
        </div>
        <div style={{margin: '12px 0'}}>
          <label>Password</label><br/>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
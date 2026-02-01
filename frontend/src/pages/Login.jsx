import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(formData.username, formData.password);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 4 }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary" align="center">
                        Welcome Back
                    </Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField
                        label="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        fullWidth
                    />
                    <Button type="submit" variant="contained" size="large" fullWidth>
                        Login
                    </Button>
                    <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                        Don't have an account? <Link to="/register" style={{ textDecoration: 'none', color: '#6200ea' }}>Sign Up</Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;

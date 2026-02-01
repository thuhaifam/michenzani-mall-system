import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, MenuItem } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'BUSINESS' });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (error) {
            alert('Registration Failed');
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 4 }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="secondary" align="center">
                        Join Us
                    </Typography>
                    <TextField
                        label="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    <Button type="submit" variant="contained" color="secondary" size="large" fullWidth>
                        Sign Up
                    </Button>
                    <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                        Already have an account? <Link to="/login" style={{ textDecoration: 'none', color: '#00bfa5' }}>Login</Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;

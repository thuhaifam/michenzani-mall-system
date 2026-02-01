import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Paper, Chip, CircularProgress, Card, CardContent, Divider } from '@mui/material';
import { ArrowBack, CalendarMonth, AttachMoney, AspectRatio, CheckCircle } from '@mui/icons-material';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const FrameDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [frame, setFrame] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFrame();
    }, [id]);

    const fetchFrame = async () => {
        try {
            const res = await api.get(`frames/${id}/`);
            setFrame(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress size={60} /></Box>;
    if (!frame) return <Typography>Frame not found</Typography>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/dashboard')}
                sx={{ mb: 3 }}
            >
                Back to Dashboard
            </Button>

            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Box
                            component="img"
                            src={frame.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'}
                            alt={`Frame ${frame.number}`}
                            sx={{
                                width: '100%',
                                height: 500,
                                objectFit: 'cover'
                            }}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Typography variant="h3" fontWeight="bold">
                                Frame {frame.number}
                            </Typography>
                            <Chip
                                label={frame.status}
                                color={frame.status === 'AVAILABLE' ? 'success' : 'default'}
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Box>

                        <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
                            TZS {frame.price}/month
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <AspectRatio color="action" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Size</Typography>
                                    <Typography variant="h6">{frame.size}</Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Features & Amenities
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
                            {frame.features}
                        </Typography>

                        {user?.role === 'BUSINESS' && (
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={frame.status !== 'AVAILABLE'}
                                startIcon={<CalendarMonth />}
                                sx={{ mt: 3, py: 1.5 }}
                                onClick={() => navigate(`/book/${frame.id}`)}
                            >
                                {frame.status === 'AVAILABLE' ? 'Book This Frame' : 'Currently Unavailable'}
                            </Button>
                        )}
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 4, borderRadius: 3, bgcolor: 'primary.main', color: 'white' }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            Why Choose This Frame?
                        </Typography>
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={4}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                    <CheckCircle />
                                    <Box>
                                        <Typography variant="h6" gutterBottom>Prime Location</Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Located in the heart of Michenzani Mall with high foot traffic
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                    <CheckCircle />
                                    <Box>
                                        <Typography variant="h6" gutterBottom>Flexible Terms</Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Choose your booking duration with easy payment options
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                    <CheckCircle />
                                    <Box>
                                        <Typography variant="h6" gutterBottom>Full Support</Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            24/7 maintenance and customer support for all tenants
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default FrameDetail;

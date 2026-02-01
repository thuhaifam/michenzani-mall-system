import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Grid, Card, CardContent, CardMedia, Button, Chip, CircularProgress, CardActions, TextField, InputAdornment } from '@mui/material';
import { CalendarMonth, AttachMoney, Visibility, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const BusinessDashboard = () => {
    const [tab, setTab] = useState(0);

    return (
        <Box>
            <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">
                Business Dashboard
            </Typography>
            <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Tab label="Browse Frames" />
                <Tab label="My Bookings" />
            </Tabs>
            {tab === 0 && <BrowseFrames />}
            {tab === 1 && <MyBookings />}
        </Box>
    );
};

const BrowseFrames = () => {
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchFrames();
    }, []);

    const fetchFrames = async () => {
        try {
            const res = await api.get('frames/');
            setFrames(res.data);
        } catch (err) {
            console.error("Error fetching frames", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredFrames = frames.filter(frame => {
        // Only show available frames to business users
        if (frame.status !== 'AVAILABLE') return false;

        const matchesSearch = frame.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            frame.features.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Find Your Perfect Space
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Browse available business spaces at Michenzani Mall
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <TextField
                        placeholder="Search by frame number or features..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Box>

            <Grid container spacing={3}>
                {filteredFrames.map((frame) => (
                    <Grid item xs={12} sm={6} md={4} key={frame.id}>
                        <Card sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 12px 32px rgba(98, 0, 234, 0.15)'
                            }
                        }}>
                            <CardMedia
                                component="img"
                                height="220"
                                image={frame.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'}
                                alt={`Frame ${frame.number}`}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Frame {frame.number}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <AttachMoney color="primary" />
                                    <Typography variant="h6" color="primary" fontWeight="bold">
                                        TZS {frame.price}/month
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" paragraph sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    minHeight: '60px'
                                }}>
                                    {frame.features}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip label={frame.size} size="small" variant="outlined" />
                                </Box>
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<Visibility />}
                                    onClick={() => navigate(`/frame/${frame.id}`)}
                                >
                                    View Details
                                </Button>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => navigate(`/book/${frame.id}`)}
                                    startIcon={<CalendarMonth />}
                                >
                                    Book Now
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {filteredFrames.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No frames found matching your criteria
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('bookings/');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                My Bookings
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                View and manage your frame reservations
            </Typography>

            {bookings.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No bookings yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Start by browsing available frames and make your first booking!
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {bookings.map((booking) => (
                        <Grid item xs={12} md={6} key={booking.id}>
                            <Card sx={{
                                display: 'flex',
                                transition: 'box-shadow 0.3s',
                                '&:hover': {
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                }
                            }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 200 }}
                                    image={booking.frame_details?.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'}
                                    alt={`Frame ${booking.frame_details?.number}`}
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                            <Typography variant="h6" fontWeight="bold">
                                                Frame {booking.frame_details?.number}
                                            </Typography>
                                            <Chip
                                                label={booking.is_paid ? 'Paid' : 'Pending'}
                                                color={booking.is_paid ? 'success' : 'warning'}
                                                size="small"
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <CalendarMonth fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {booking.start_date} to {booking.end_date}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AttachMoney fontSize="small" color="action" />
                                            <Typography variant="h6" color="primary" fontWeight="bold">
                                                TZS {booking.total_amount}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default BusinessDashboard;

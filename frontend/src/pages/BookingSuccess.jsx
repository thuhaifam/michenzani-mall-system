import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper, Card, CardContent, Divider } from '@mui/material';
import { CheckCircle, CalendarMonth, AttachMoney, Home } from '@mui/icons-material';
import Confetti from 'react-confetti';

const BookingSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { frame, bookingData, totalAmount } = location.state || {};

    if (!frame) {
        navigate('/dashboard');
        return null;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                numberOfPieces={500}
            />

            <Paper sx={{ p: 6, borderRadius: 3, textAlign: 'center' }}>
                <Box sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 3
                }}>
                    <CheckCircle sx={{ fontSize: 60, color: 'white' }} />
                </Box>

                <Typography variant="h3" gutterBottom fontWeight="bold" color="success.main">
                    Booking Confirmed!
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                    Your space at Michenzani Mall has been successfully reserved
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Card sx={{ mt: 4, textAlign: 'left' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Booking Details
                        </Typography>

                        <Box sx={{ mt: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Home color="primary" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Frame Number
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        Frame {frame.number}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <CalendarMonth color="primary" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Booking Period
                                    </Typography>
                                    <Typography variant="body1">
                                        {bookingData?.start_date} to {bookingData?.end_date}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <AttachMoney color="primary" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Total Amount Paid
                                    </Typography>
                                    <Typography variant="h6" color="success.main" fontWeight="bold">
                                        TZS {totalAmount}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="body2" color="text.secondary">
                            A confirmation email has been sent to <strong>{bookingData?.contact_email}</strong>
                        </Typography>
                    </CardContent>
                </Card>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/dashboard')}
                    >
                        View My Bookings
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/dashboard')}
                    >
                        Browse More Frames
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default BookingSuccess;

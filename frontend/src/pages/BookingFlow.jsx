import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Stepper, Step, StepLabel, Paper, Grid, TextField, Card, CardContent, Divider, CircularProgress, Alert } from '@mui/material';
import { ArrowBack, ArrowForward, CalendarMonth, AttachMoney, CheckCircle } from '@mui/icons-material';
import api from '../api';

const steps = ['Select Dates', 'Review Details', 'Payment'];

const BookingFlow = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [frame, setFrame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({
        start_date: '',
        end_date: '',
        business_name: '',
        contact_email: '',
        contact_phone: ''
    });
    const [totalAmount, setTotalAmount] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFrame();
    }, [id]);

    useEffect(() => {
        if (bookingData.start_date && bookingData.end_date && frame) {
            calculateTotal();
        }
    }, [bookingData.start_date, bookingData.end_date, frame]);

    const fetchFrame = async () => {
        try {
            const res = await api.get(`frames/${id}/`);
            setFrame(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load frame details');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        const start = new Date(bookingData.start_date);
        const end = new Date(bookingData.end_date);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = diffDays / 30;
        const total = months * frame.price;
        setTotalAmount(total > 0 ? total.toFixed(2) : frame.price);
    };

    const handleNext = () => {
        if (activeStep === 0) {
            if (!bookingData.start_date || !bookingData.end_date) {
                setError('Please select both start and end dates');
                return;
            }
            if (new Date(bookingData.start_date) >= new Date(bookingData.end_date)) {
                setError('End date must be after start date');
                return;
            }
        }
        if (activeStep === 1) {
            if (!bookingData.business_name || !bookingData.contact_email || !bookingData.contact_phone) {
                setError('Please fill in all contact details');
                return;
            }
        }
        setError('');
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleConfirmBooking = async () => {
        try {
            await api.post('bookings/', {
                frame: frame.id,
                start_date: bookingData.start_date,
                end_date: bookingData.end_date,
                total_amount: totalAmount,
                is_paid: true
            });
            navigate('/booking-success', { state: { frame, bookingData, totalAmount } });
        } catch (err) {
            console.error(err);
            setError('Booking failed. Please try again.');
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress size={60} /></Box>;
    if (!frame) return <Typography>Frame not found</Typography>;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/dashboard')}
                sx={{ mb: 3 }}
            >
                Back to Dashboard
            </Button>

            <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                    Book Frame {frame.number}
                </Typography>

                <Stepper activeStep={activeStep} sx={{ mt: 4, mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {activeStep === 0 && (
                    <Box>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Select Your Booking Dates
                        </Typography>
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={bookingData.start_date}
                                    onChange={(e) => setBookingData({ ...bookingData, start_date: e.target.value })}
                                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="End Date"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={bookingData.end_date}
                                    onChange={(e) => setBookingData({ ...bookingData, end_date: e.target.value })}
                                    inputProps={{ min: bookingData.start_date || new Date().toISOString().split('T')[0] }}
                                />
                            </Grid>
                        </Grid>

                        {bookingData.start_date && bookingData.end_date && (
                            <Card sx={{ mt: 3, bgcolor: 'primary.main', color: 'white' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Estimated Total
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold">
                                        TZS {totalAmount}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                                        Based on TZS {frame.price}/month
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                )}

                {activeStep === 1 && (
                    <Box>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Business & Contact Information
                        </Typography>
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Business Name"
                                    fullWidth
                                    value={bookingData.business_name}
                                    onChange={(e) => setBookingData({ ...bookingData, business_name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Contact Email"
                                    type="email"
                                    fullWidth
                                    value={bookingData.contact_email}
                                    onChange={(e) => setBookingData({ ...bookingData, contact_email: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Contact Phone"
                                    fullWidth
                                    value={bookingData.contact_phone}
                                    onChange={(e) => setBookingData({ ...bookingData, contact_phone: e.target.value })}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Booking Summary
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography color="text.secondary">Frame:</Typography>
                                <Typography fontWeight="bold">Frame {frame.number}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography color="text.secondary">Duration:</Typography>
                                <Typography fontWeight="bold">{bookingData.start_date} to {bookingData.end_date}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography color="text.secondary">Monthly Rate:</Typography>
                                <Typography fontWeight="bold">TZS {frame.price}</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6">Total Amount:</Typography>
                                <Typography variant="h6" color="primary" fontWeight="bold">TZS {totalAmount}</Typography>
                            </Box>
                        </Box>
                    </Box>
                )}

                {activeStep === 2 && (
                    <Box>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Payment Confirmation
                        </Typography>
                        <Card sx={{ mt: 3, p: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <AttachMoney sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        TZS {totalAmount}
                                    </Typography>
                                    <Typography variant="body2">
                                        Total Payment Amount
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>

                        <Alert severity="info" sx={{ mt: 3 }}>
                            This is a mock payment. In production, this would integrate with a payment gateway.
                        </Alert>

                        <Box sx={{ mt: 3, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Booking Details
                            </Typography>
                            <Typography variant="body2" paragraph>
                                <strong>Frame:</strong> {frame.number}<br />
                                <strong>Business:</strong> {bookingData.business_name}<br />
                                <strong>Duration:</strong> {bookingData.start_date} to {bookingData.end_date}<br />
                                <strong>Contact:</strong> {bookingData.contact_email}
                            </Typography>
                        </Box>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        startIcon={<ArrowBack />}
                    >
                        Back
                    </Button>
                    {activeStep === steps.length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={handleConfirmBooking}
                            endIcon={<CheckCircle />}
                            size="large"
                        >
                            Confirm & Pay
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            endIcon={<ArrowForward />}
                        >
                            Next
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default BookingFlow;

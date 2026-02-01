import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Grid, Card, CardContent, CardMedia, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, CardActions } from '@mui/material';
import { Visibility, Edit, Delete, Add, People } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminDashboard = () => {
    const [tab, setTab] = useState(0);

    return (
        <Box>
            <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">
                Admin Dashboard
            </Typography>
            <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Tab label="Manage Frames" />
                <Tab label="Bookings Overview" />
                <Tab label="Business Users" />
            </Tabs>
            {tab === 0 && <FramesManager />}
            {tab === 1 && <BookingsManager />}
            {tab === 2 && <BusinessUsersManager />}
        </Box>
    );
};

const FramesManager = () => {
    const [frames, setFrames] = useState([]);
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [frameToDelete, setFrameToDelete] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(null);
    const [formData, setFormData] = useState({ number: '', size: '', price: '', features: '', status: 'AVAILABLE', image_url: '' });
    const navigate = useNavigate();

    useEffect(() => { fetchFrames(); }, []);

    const fetchFrames = async () => {
        try {
            const res = await api.get('frames/');
            setFrames(res.data);
        } catch (error) { console.error(error); }
    };

    const handleOpen = (frame = null) => {
        if (frame) {
            setEditMode(true);
            setCurrentFrame(frame);
            setFormData(frame);
        } else {
            setEditMode(false);
            setCurrentFrame(null);
            setFormData({ number: '', size: '', price: '', features: '', status: 'AVAILABLE', image_url: '' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
        setCurrentFrame(null);
        setFormData({ number: '', size: '', price: '', features: '', status: 'AVAILABLE', image_url: '' });
    };

    const handleSubmit = async () => {
        try {
            if (editMode) {
                await api.put(`frames/${currentFrame.id}/`, formData);
            } else {
                await api.post('frames/', formData);
            }
            handleClose();
            fetchFrames();
        } catch (error) {
            console.error(error);
            alert(`Error ${editMode ? 'updating' : 'creating'} frame`);
        }
    };

    const handleDeleteClick = (frame) => {
        setFrameToDelete(frame);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`frames/${frameToDelete.id}/`);
            setDeleteDialogOpen(false);
            setFrameToDelete(null);
            fetchFrames();
        } catch (error) {
            console.error(error);
            alert('Error deleting frame');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setFrameToDelete(null);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">All Frames</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Add New Frame</Button>
            </Box>
            <Grid container spacing={3}>
                {frames.map((frame) => (
                    <Grid item xs={12} sm={6} md={4} key={frame.id}>
                        <Card sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                            }
                        }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={frame.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'}
                                alt={`Frame ${frame.number}`}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="h6" fontWeight="bold">Frame {frame.number}</Typography>
                                    <Chip
                                        label={frame.status}
                                        color={frame.status === 'AVAILABLE' ? 'success' : 'warning'}
                                        size="small"
                                    />
                                </Box>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    TZS {frame.price}/month
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Size: {frame.size}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {frame.features}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                <Button
                                    size="small"
                                    startIcon={<Visibility />}
                                    onClick={() => navigate(`/frame/${frame.id}`)}
                                >
                                    View
                                </Button>
                                <Box>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleOpen(frame)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteClick(frame)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? 'Edit Frame' : 'Add New Frame'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Frame Number"
                            value={formData.number}
                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Size"
                            value={formData.size}
                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                            fullWidth
                            placeholder="e.g., 20x20 sqft"
                        />
                        <TextField
                            label="Price (Monthly)"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Features"
                            multiline
                            rows={3}
                            value={formData.features}
                            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Image URL"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            fullWidth
                            placeholder="https://example.com/image.jpg"
                        />
                        <TextField
                            select
                            label="Status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            fullWidth
                            SelectProps={{ native: true }}
                        >
                            <option value="AVAILABLE">Available</option>
                            <option value="BOOKED">Booked</option>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {editMode ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete Frame {frameToDelete?.number}? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

const BookingsManager = () => {
    const [bookings, setBookings] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('bookings/');
            setBookings(res.data);
        } catch (error) { console.error(error); }
    };

    const handleDeleteClick = (booking) => {
        setBookingToDelete(booking);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`bookings/${bookingToDelete.id}/`);
            setDeleteDialogOpen(false);
            setBookingToDelete(null);
            fetchBookings();
        } catch (error) {
            console.error(error);
            alert('Error deleting booking');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setBookingToDelete(null);
    };

    return (
        <>
            <TableContainer component={Paper} sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Frame</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Dates</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Paid</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                                <TableCell>{booking.id}</TableCell>
                                <TableCell>{booking.user?.username}</TableCell>
                                <TableCell>
                                    <Chip label={`Frame ${booking.frame_details?.number}`} size="small" color="primary" variant="outlined" />
                                </TableCell>
                                <TableCell>{booking.start_date} to {booking.end_date}</TableCell>
                                <TableCell>
                                    <Typography fontWeight="bold" color="success.main">TZS {booking.total_amount}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={booking.is_paid ? 'Paid' : 'Pending'}
                                        color={booking.is_paid ? 'success' : 'warning'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteClick(booking)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete booking #{bookingToDelete?.id}? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const BusinessUsersManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('auth/users/');
            setUsers(res.data.filter(u => u.role === 'BUSINESS'));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Business Users Management
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                View and manage all business users registered in the system
            </Typography>

            <TableContainer component={Paper} sx={{ mt: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'secondary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Username</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <People fontSize="small" color="action" />
                                        <Typography fontWeight="medium">{user.username}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip label={user.role} size="small" color="info" />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.is_active ? 'Active' : 'Inactive'}
                                        size="small"
                                        color={user.is_active ? 'success' : 'default'}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {users.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No business users found
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default AdminDashboard;

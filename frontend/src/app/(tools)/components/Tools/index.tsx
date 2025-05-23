import React from 'react';
import { Box, Button, Typography, Grid, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Apartment, House, Build, List as ListIcon } from '@mui/icons-material';
import { pink, orange } from '@mui/material/colors';

const CongcuTools = () => {
    return (
        <Box
            sx={{
                backgroundColor: orange[50],
                minHeight: '100vh',
                padding: '20px',
                textAlign: 'center',
            }}
        >
            

            {/* Các hình ảnh và icon có thể thêm vào tùy ý */}
            <Box sx={{ marginTop: '30px' }}>
                <Typography variant="h6" sx={{ marginBottom: '20px', color: 'salmon' }}>
                    Các công cụ khác
                </Typography>
                <Grid container spacing={10} justifyContent="center">
                    {/* Thêm hình ảnh hoặc icon */}
                    <Paper elevation={3} sx={{ p: 5, textAlign: 'center', width: '80%' }}>
                        <List>
                            <ListItem button>
                                <ListItemText primary="Thông tin tài khoản" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemText primary="Thông tin chung cư" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemText primary="Thông tin căn hộ" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemText primary="Đơn khiếu nại" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemText primary="Hợp đồng" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemText primary="Góp ý" />
                            </ListItem>
                            <Divider />
                        </List>
                    </Paper>
                </Grid>
            </Box>
        </Box>
    );
};

export default CongcuTools;

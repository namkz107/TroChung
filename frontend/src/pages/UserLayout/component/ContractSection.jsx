import {
    Box,
    Typography,
    Grid,
    Button,
} from "@mui/material";
import React from "react";

const ContractSection = ({ 
    contractImages,
    handleContractUpload,
    removeImage,
    disabled = false
}) => {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography
                variant="subtitle1"
                fontWeight="bold"
                mb={1}
                sx={{ textAlign: 'left' }}
            >
                Bảng hợp đồng
            </Typography>
            
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 10, md: 8, lg: 8 }}>
                    <Typography variant="body2" mb={1} sx={{ fontWeight: 'medium' }}>
                        Hình ảnh
                    </Typography>
                    
                    <Grid container spacing={1}>
                        {/* Nút upload */}
                        <Grid size={{ xs: 6, sm: 3, md: 2, lg: 2 }}>
                            <Box
                                component="label"
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '120px',
                                    border: '2px dashed #FF9800',
                                    borderRadius: 1,
                                    bgcolor: '#FFF3E0',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        bgcolor: '#FFE0B2'
                                    }
                                }}
                            >
                                <Box sx={{ fontSize: '24px', mb: 1 }}>+</Box>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    Upload ảnh
                                </Typography>
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    accept="image/*"
                                    onChange={handleContractUpload}
                                    disabled={disabled}
                                />
                            </Box>
                        </Grid>
                        
                        {/* Ảnh hợp đồng đã upload */}
                        {contractImages.map((image, index) => (
                            <Grid size={{ xs: 6, sm: 3, md: 2, lg: 2 }} key={index}>
                                <Box sx={{ position: 'relative' }}>
                                    <Box
                                        sx={{
                                            height: '120px',
                                            border: '1px solid #ddd',
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            bgcolor: '#f5f5f5'
                                        }}
                                    >
                                        {typeof image === 'string' ? (
                                            <img
                                                src={image}
                                                alt={`Contract ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Contract ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        )}
                                    </Box>
                                    <Button
                                        size="small"
                                        color="error"
                                            onClick={() => removeImage(index, 'contract')}
                                            disabled={disabled}
                                        sx={{
                                            position: 'absolute',
                                            top: -8,
                                            right: -8,
                                            minWidth: '24px',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            p: 0,
                                            bgcolor: 'white',
                                            '&:hover': {
                                                bgcolor: '#ffebee'
                                            }
                                        }}
                                    >
                                        ✕
                                    </Button>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ContractSection;
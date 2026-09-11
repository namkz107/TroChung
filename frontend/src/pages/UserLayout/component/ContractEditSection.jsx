import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';

const ContractEditSection = ({
  contractUrls = [],
  contractImages = [],
  handleContractUpload,
  removeImage,
  disabled = false,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold" mb={1} sx={{ textAlign: 'left' }}>
        Bảng hợp đồng
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={10} md={8} lg={8}>
          <Grid container spacing={1}>
            <Grid item xs={6} sm={3} md={2} lg={2}>
              <Box component="label" sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: '120px', border: '2px dashed #FF9800', borderRadius: 1, bgcolor: '#FFF3E0', cursor: 'pointer'
              }}>
                <Box sx={{ fontSize: '24px', mb: 1 }}>+</Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Upload ảnh</Typography>
                <input type="file" hidden multiple accept="image/*" onChange={handleContractUpload} disabled={disabled} />
              </Box>
            </Grid>

            {/* existing contract URLs */}
            {Array.isArray(contractUrls) && contractUrls.map((url, idx) => (
              <Grid item xs={6} sm={3} md={2} lg={2} key={`existing-contract-${idx}`}>
                <Box sx={{ position: 'relative' }}>
                  <Box sx={{ height: '120px', border: '1px solid #ddd', borderRadius: 1, overflow: 'hidden', bgcolor: '#f5f5f5' }}>
                    <img src={url} alt={`contract-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                  <Button size="small" color="error" onClick={() => removeImage(idx, 'contract', 'existing')} disabled={disabled}
                    sx={{ position: 'absolute', top: -8, right: -8, minWidth: '24px', width: '24px', height: '24px', borderRadius: '50%', p: 0, bgcolor: 'white' }}>
                    ✕
                  </Button>
                </Box>
              </Grid>
            ))}

            {/* newly selected contract files */}
            {contractImages.map((file, idx) => (
              <Grid item xs={6} sm={3} md={2} lg={2} key={`new-contract-${idx}`}>
                <Box sx={{ position: 'relative' }}>
                  <Box sx={{ height: '120px', border: '1px solid #ddd', borderRadius: 1, overflow: 'hidden', bgcolor: '#f5f5f5' }}>
                    <img src={URL.createObjectURL(file)} alt={`new-contract-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                  <Button size="small" color="error" onClick={() => removeImage(idx, 'contract', 'new')} disabled={disabled}
                    sx={{ position: 'absolute', top: -8, right: -8, minWidth: '24px', width: '24px', height: '24px', borderRadius: '50%', p: 0, bgcolor: 'white' }}>
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

export default ContractEditSection;

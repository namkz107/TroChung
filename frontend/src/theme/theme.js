import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1000, xl: 1200 } },
  palette: {
    primary: { main: '#176b58', light: '#4f9a84', dark: '#0d4b3e', contrastText: '#ffffff' },
    secondary: { main: '#d69b45', light: '#edbd78', dark: '#9d6826', contrastText: '#ffffff' },
    tertiary: { main: '#e8efeb', light: '#f7faf8', dark: '#cbd8d1', contrastText: '#12372f' },
    background: { default: '#f7f9f6', paper: '#ffffff' },
    text: { primary: '#173b33', secondary: '#667a72' },
    divider: 'rgba(23, 59, 51, 0.11)',
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"DM Sans", "Segoe UI", sans-serif',
    h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700, letterSpacing: '-0.035em' },
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700, letterSpacing: '-0.03em' },
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 700, letterSpacing: '-0.025em' },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h5: { fontWeight: 700 }, h6: { fontWeight: 700 }, body1: { fontSize: '.95rem' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { backgroundColor: '#f7f9f6' }, '*': { scrollbarWidth: 'thin', scrollbarColor: '#a9c6bc transparent' } } },
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { borderRadius: 12, minHeight: 40, paddingLeft: 18, paddingRight: 18, transition: 'transform .2s ease, box-shadow .2s ease, background-color .2s ease', '&:hover': { transform: 'translateY(-1px)' } }, contained: { boxShadow: '0 8px 20px rgba(23,107,88,.18)', '&:hover': { boxShadow: '0 12px 26px rgba(23,107,88,.24)' } } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none', borderRadius: 18 }, elevation1: { boxShadow: '0 10px 35px rgba(18,55,47,.07)', border: '1px solid rgba(23,59,51,.07)' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 20, boxShadow: '0 10px 35px rgba(18,55,47,.07)', border: '1px solid rgba(23,59,51,.07)' } } },
    MuiTextField: { defaultProps: { variant: 'outlined' }, styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 12, background: '#fff', transition: 'box-shadow .2s ease', '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(23,107,88,.1)' } } } } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 12, background: '#fff' } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 24 } } },
    MuiMenu: { styleOverrides: { paper: { borderRadius: 16, marginTop: 8, boxShadow: '0 18px 48px rgba(18,55,47,.14)' } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 10, fontWeight: 600 } } },
    MuiTableContainer: { styleOverrides: { root: { borderRadius: 18, border: '1px solid rgba(23,59,51,.08)' } } },
    MuiTableHead: { styleOverrides: { root: { background: '#edf5f1' } } },
    MuiTooltip: { styleOverrides: { tooltip: { borderRadius: 8, background: '#12372f' } } },
  },
});

theme.palette.sidebar = { main: '#176b58', dark: '#0d4b3e', gradient: 'linear-gradient(180deg, #176b58 0%, #0d4b3e 100%)', shadow: 'rgba(23,107,88,.16)' };
theme.palette.formSections = {
  interests: { background: 'rgba(23,107,88,.05)', shadow: 'rgba(23,107,88,.1)', shadowHover: 'rgba(23,107,88,.16)' },
  habits: { background: 'rgba(214,155,69,.06)', shadow: 'rgba(214,155,69,.1)', shadowHover: 'rgba(214,155,69,.16)' },
  dislikes: { background: 'rgba(79,154,132,.05)', shadow: 'rgba(79,154,132,.1)', shadowHover: 'rgba(79,154,132,.16)' },
};

export default theme;

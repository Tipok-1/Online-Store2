import AppRouter from './components/AppRouter'
import React from 'react'
import { authApiUser, apiUser } from './services/authService';
import { IAuthResponse } from './models/response/AuthResponse';
import { ThemeProvider, createTheme, PaletteColor } from '@mui/material/styles';
import { useAppDispatch } from './hooks/redux';
import { deviceGroupSlice } from './store/reducers/DeviceGroupSlice';



const { palette } = createTheme();
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    customColor: palette.augmentColor({
      color: {
        main: 'rgb(230, 141, 24)',
        dark: 'rgb(230, 141, 24)',
      },
      name: 'customColor',
    })
  },
  components: {
    MuiTabs: {
      defaultProps: {
        textColor: 'secondary'
      }
    }
  }

});

declare module "@mui/material/styles" {
  interface Palette {
    customColor: PaletteColor;
  }
  interface PaletteOptions {
    customColor: PaletteColor;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    customColor: true;
  }
}
declare module '@mui/material/Slider' {
  interface SliderPropsColorOverrides {
    customColor: true;
  }
}
declare module '@mui/material/TextField' {
  interface TextFieldPropsColorOverrides {
    customColor: true;
  }
}


function App() {
  const [trigger, result] = apiUser.useLazyCheckAuthQuery();
  const dispatch = useAppDispatch()
  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      trigger('');
    }
    window.onbeforeunload = function () {
      dispatch(deviceGroupSlice.actions.saveGroups());
    };
    if (localStorage.getItem('favoritesDevicesID')) {
      const favotiteDevices = JSON.parse(localStorage.getItem('favoritesDevicesID')!)
      dispatch(deviceGroupSlice.actions.setFavoritesDevicesID(favotiteDevices))
    }
    if(localStorage.getItem('comparedDevicesID')) {
      const comparedDevices = JSON.parse(localStorage.getItem('comparedDevicesID')!)
      dispatch(deviceGroupSlice.actions.setComparedDevicesID(comparedDevices))
    }
    
    if(localStorage.getItem('inBasketDevicesID')) {
      const inBasketDevicesID = JSON.parse(localStorage.getItem('inBasketDevicesID')!)
      dispatch(deviceGroupSlice.actions.setInBasketDevicesID(inBasketDevicesID))
    }
    if(localStorage.getItem('recentlyViewedID')) {
      const recentlyViewedID = JSON.parse(localStorage.getItem('recentlyViewedID')!)
      dispatch(deviceGroupSlice.actions.setRecentlyViewedID(recentlyViewedID))
    }
    
     
  }, [])


  return (
    <ThemeProvider theme={darkTheme}>
      <AppRouter title={`${process.env.REACT_APP_SHOP_NAME}`} loading={result.isLoading} />
    </ThemeProvider>
  );
}

export default App;

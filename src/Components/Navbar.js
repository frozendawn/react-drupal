import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useContext } from 'react';
import AuthContext from './context/auth-context';
import { useHistory } from 'react-router';
import { Box } from '@mui/system';

const Navbar = () => {
    const history = useHistory()
    const authCtx = useContext(AuthContext);

    return (
        <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Cards
          </Typography>
          { authCtx.isLoggedIn ? 
                  <Box>
                    <Typography variant="p">
                      hello {authCtx.user.name}
                    </Typography>

                   <Button color="inherit" onClick={authCtx.logout}>Logout</Button>
                  </Box> : 
                  <Box>
                    <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
                    <Button color="inherit" onClick={() => history.push('/register')}>Register</Button>
                  </Box>
          }
        </Toolbar>
      </AppBar>
    )
}

export default Navbar;

import React, {useContext, useEffect, useState} from 'react';
import './anchorCss.css';
import axios from 'axios';
import {store} from '../../store/store';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Register from './Register';
import {useNavigate} from "react-router-dom";

export default function Login(props) {
  let navigate = useNavigate();

  const [state, dispatch] = useContext(store);

  const [open, setOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const [loginInfo, setLoginInfo] = useState({password: null, email: null});
  const [authCode, setAuthCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [pwErrorMessage, setPwErrorMessage] = useState('');
  const [codeErrorMessage, setCodeErrorMessage] = useState('');

  const loginValidate = () => {
    let valid = true;
    if (!loginInfo.email) {
      setEmailErrorMessage('이메일을 입력해 주세요.');
      valid = false;
    } else setEmailErrorMessage('');
    if (!loginInfo.password) {
      setPwErrorMessage('비밀번호를 입력해 주세요.');
      valid = false;
    } else setPwErrorMessage('');
    return valid;
  };
  const codeValidate = () => {
    let valid = true;
    if (!authCode) {
      setCodeErrorMessage('인증 코드를 입력해 주세요.');
      valid = false;
    } else setCodeErrorMessage('');
    return valid;
  };

  const handleClickOpen = () => {setOpen(true)};
  const handleClickClose = () => {setOpen(false)};
  const handleAuthInfoChange = (e) => {setAuthCode(e.target.value)};
  const handleLoginInfoChange = (e) => {
    const {name, value} = e.target;
    setLoginInfo({
      ...loginInfo,
      [name]: value
    });
  };

  const handleClickLogin = async (e) => {
    e.preventDefault();
    dispatch({type: 'OpenLoading', payload: '로그인을 시도중입니다..'});
    loginValidate() &&
    await axios.post(`/auth/login`, loginInfo)
      .then(res => {
        if (res.status === 200) {
          localStorage.setItem('token', res.data.token);
          navigate(-1);
          dispatch({type: 'OpenSnackbar', payload: `로그인되었습니다.`});
        }
        else {
          setAuth(true);
        }
      })
      .catch(error => {
        if (error.response.status === 401) {
          setErrorMessage(error.response.data.message);
        } else setErrorMessage('')
        console.error(error.response);
      })
      .finally(() => dispatch({type: 'CloseLoading'}));
    dispatch({type: 'CloseLoading'})
  };
  const handleClickAuthLogin = async (e) => {
    dispatch({type: 'OpenLoading', payload: '로그인을 시도중입니다..'});
    (loginValidate() & codeValidate()) &&
    await axios.post(`/auth/mail-auth-login`, {code: authCode, ...loginInfo})
      .then(res => {
        localStorage.setItem('token', res.data.token);
        navigate('/');
        dispatch({type: 'OpenSnackbar', payload: `로그인되었습니다.`});
      })
      .catch(error => {
        setCodeErrorMessage(error.response.data.message);
        console.error(error);
      })
      .finally(() => dispatch({type: 'CloseLoading'}));
    dispatch({type: 'CloseLoading'})
  };

  useEffect(() => {
    if (authCode.length === 6) handleClickAuthLogin()
  }, [authCode]);

  return (
    <>
      <Stack sx={{
        width: 300, position: 'absolute', transform: 'translate(-50%, -50%)',
        left: '50%', top: '50%', borderRadius: '30px', padding: '60px', boxShadow: 6
      }} spacing={2} align='center'>
        <Grid align='center'>
          <MenuBookIcon color='primary' sx={{fontSize: 100}}/>
          <Typography variant='h4' color='primary' fontWeight='bold'>모두의 일기장</Typography>
        </Grid>

        <Box component="form">
          <Stack spacing={1}>
            <TextField label='Email' name="email" onChange={handleLoginInfoChange}
                       helperText={emailErrorMessage} error={!!emailErrorMessage}
                       inputProps={{autoComplete: "username"}}
            />
            <TextField label='PW' type='password' name="password" onChange={handleLoginInfoChange}
                       helperText={pwErrorMessage} error={!!pwErrorMessage}
                       inputProps={{autoComplete: "password"}}
            />
            {auth &&
              <>
                <Typography variant='subtitle2' color="text.secondary" sx={{textAlign: 'start'}}>등록된 이메일로 인증코드가
                  발송되었습니다.</Typography>
                <TextField
                  label='인증코드' name="code" value={authCode}
                  helperText={codeErrorMessage} error={!!codeErrorMessage}
                  onChange={handleAuthInfoChange}
                  inputProps={{maxLength: 6, autocomplete: 'off'}}
                />
                <Box sx={{textAlign: 'end'}}>
                  <Button onClick={handleClickLogin} size='small' sx={{width: 'max-content'}}>인증코드 재전송</Button>
                </Box>
              </>
            }

            <Button type='submit' variant='contained' color='success'
                    onClick={auth ? handleClickAuthLogin : handleClickLogin}>
              {auth ? '확인' : '로그인'}
            </Button>
            <Typography color='red' fontSize={12}>{errorMessage}</Typography>
          </Stack>
        </Box>

        <a href="/">아이디/비밀번호를 잊어버렸어요</a>
        <Button onClick={handleClickOpen} variant='contained'>회원가입</Button>
      </Stack>

      <Dialog open={open} onClose={handleClickClose} maxWidth='xs' fullWidth={true}>
        <DialogContent>
          <Register/>
        </DialogContent>
      </Dialog>
    </>
  );
}

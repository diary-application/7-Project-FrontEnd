import React, {useState} from 'react';
import Typography from '@mui/material/Typography';
import { Grid , Paper, FormControlLabel, TextField, Checkbox, Button, FormLabel, RadioGroup, FormControl, Radio } from '@material-ui/core';

const Register=()=> {
    const gridstyle={margin:"0 auto", width: "350px"}
    const paperStyle={display:'flex',flexDirection:'column',padding:20, widht:280, margin: "20px auto"}
    const marginTop = { marginTop: 5 }
    
    

    return(
        <>
            <Grid style={gridstyle}>
                <Paper elecation={15} style={paperStyle}>
                    <Grid align='center'>
                        {/* 로고 */}
                        <h2>Sign Up</h2>
                    </Grid>
                    <Typography variant='caption' align='center' gutterBottom>create an account</Typography>
                </Paper>
                <form>
                    <TextField fullWidth label='Name' placeholder="Enter your name" />
                    <TextField fullWidth label='Email' placeholder="Enter your email" />
                    <TextField fullWidth label='Password' placeholder="Enter your password" type='password'/>
                    <FormControlLabel
                        control={<Checkbox 
                            
                        />}label="show"
                    />
                    <TextField fullWidth label='Confirm Password' placeholder="Confirm your password" type='password'/>
                    <TextField fullWidth label='Phone Number' placeholder="Enter your phone number" />
                    <FormControl component="fieldset" style={marginTop}>
                        <FormLabel component="legend">Gender</FormLabel>
                        <RadioGroup aria-label="gender" name="gender" style={{ display: 'initial' }}>
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                        </RadioGroup>
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox name="checkedA" />}
                        label="약관에 동의합니다."
                    />
                    <Button type='submit' variant='contained' color='primary'>Sign up</Button>
                </form>


            </Grid>
        
        
        </>
    )
}

export default Register;
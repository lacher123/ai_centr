import React from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const cities = [
    {
      value: 'Москва',
      name: 'Москва',
    },
    {
      value: 'Екатеринбург',
      name: 'Екатеринбург',
    },
    {
      value: 'Челябинск',
      name: 'Челябинск',
    },
    {
      value: 'Владивосток',
      name: 'Владивосток',
    },
  ];

  const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '220px',
      },
    },
  }));  

export default function ListOfCities() {
    const classes = useStyles();

    const [citiy, setCity] = React.useState('Владивосток');

    const handleChange = (event) => {
        setCity(event.target.value);
    };

    return (
    <form className={classes.root} noValidate autoComplete="off">
    <TextField
          id="outlined-select-city"
          select
          label="Город"
          value={citiy}
          onChange={handleChange}
          variant="outlined"
        >
          {cities.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
        </form>
    );
}
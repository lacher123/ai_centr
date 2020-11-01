import React, { useReducer } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Image from 'material-ui-image';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import MapIcon from '@material-ui/icons/Map';
import NotListedLocationOutlinedIcon from '@material-ui/icons/NotListedLocationOutlined';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Public from '@material-ui/icons/Public';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';


import {DisplayMapClass} from './DisplayMapClass';
import ListOfCities from './ListOfCities';

import {resultPoints} from './result';
import {objPoints} from './attraction';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
}));


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function reducer(state, action) {
  switch (action.type) {
    case 'openResult':
      return { ...state, openResult: !state.openResult };
    case 'openVisualSettings':
      return { ...state, openVisualSettings: !state.openVisualSettings };
      case 'visualisationType':
        return { ...state, visualisationType: action.value }; 
      case 'setCategory':
        return { ...state, visualisationCategory: action.value };         
      case 'setvisualisationType':
        return { ...state, activevisualisationType: state.visualisationType, openVisualSettings: !state.openVisualSettings, openSnackbar: true };            
      case 'closeSnackbar':
        return { ...state, openSnackbar: false };
      case 'openSidebar':
        return { ...state, openSidebar: !state.openSidebar }; 
        case 'setResPoint':
          return { ...state, resPoint: action.value };             
    default:
      throw new Error();
  }
}

function getData()
{
  let arr = [];
  for(let i=0; i < objPoints.length; i=i+4) {
      arr.push({"category": objPoints[i], "description": objPoints[i+1], "la": parseFloat(objPoints[i+2]), "lg": parseFloat(objPoints[i+3])});
  }
  return arr;
}

export default function MainView() {

  const data = getData();
  const categories = [];
  data.forEach(function(item, index, array) {
    if(categories.indexOf(item.category)===-1)
    {
      categories.push(item.category);
    }
  });

  const initialState = {
      resPoint: [0.0, 0.0],
      openResult: false, 
      openVisualSettings: false, 
      visualisationType: 'none', 
      activevisualisationType: 'none',
      openSnackbar:false,
      visualisationCategory: ""
    };

  const [state, dispatch] = useReducer(reducer, initialState);

  const classes = useStyles();

  const theme = useTheme();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerContainer}>
          <Image alt="AI Centr" src="logo.png" />
          <ListOfCities />
          <Divider /> 
          <List>
            {[
              {caption: 'Исходные данные', action: () => dispatch({type: 'openResult'}), icon: <NotListedLocationOutlinedIcon />}, 
              {caption: 'Расчет', action: () => dispatch({type: 'openResult'}), icon: <PlayCircleOutlineIcon />}, 
              {caption: 'Визуализация', action: () => dispatch({type: 'openVisualSettings'}), icon: <Public />}, 
              {caption: 'Рекомендации по размещению', action: () => dispatch({type: 'openSidebar'}), icon: <SentimentVerySatisfiedIcon />}].map((mi, index) => (
              <ListItem button key={mi.caption} onClick={mi.action}>
                <ListItemIcon>{mi.icon}</ListItemIcon>
                <ListItemText primary={mi.caption} />
              </ListItem>
            ))}
          </List>
          <Divider />          
        </div>
      </Drawer>
      <main className={classes.content}>
        <DisplayMapClass resPoint={state.resPoint} visualisationType={state.activevisualisationType} visualisationCategory={state.visualisationCategory} />
      </main>

      <Dialog
        open={state.openResult}
        onClose={() => dispatch({type: 'openResult'})}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth="md"
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">{"В разработке"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Данный функционал находится в разработке
          </DialogContentText>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch({type: 'openResult'})} color="primary">
            Ок
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={state.openVisualSettings}
        onClose={() => dispatch({type: 'openVisualSettings'})}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Укажите тип визуализации"}</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup aria-label="visualisationType" name="visualisationType1" value={state.visualisationType} onChange={(event) => dispatch({type: 'visualisationType', value: event.target.value})}>
              <FormControlLabel value="none" control={<Radio />} label="Карта без визуализации" />
              <FormControlLabel value="heatMap" control={<Radio />} label="Тепловая карта по плотности населения" />
              <FormControlLabel value="populationCluster" control={<Radio />} label="Кластеризация по плотности населения" />
              <FormControlLabel value="infrastructureCluster" control={<Radio />} label="Кластеризация по объектам инфраструктуры" />
            </RadioGroup>
            <br></br>
            <TextField
              id="outlined-select-object"
              select
              label="Тип объекта"
              variant="outlined"
              onChange={(event) => dispatch({type: 'setCategory', value: event.target.value})}
            >
                {categories.map((mi, index) => (
                <MenuItem key={mi} value={mi}>
                  {mi}
                </MenuItem>                  
                ))}

            </TextField>

          </FormControl>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => dispatch({type: 'setvisualisationType'})} color="primary">
            Ок
          </Button>
          <Button onClick={() => dispatch({type: 'openVisualSettings'})} color="primary">
            Отмена
          </Button>
        </DialogActions>
      </Dialog>  

      <Snackbar open={state.openSnackbar} autoHideDuration={6000} onClose={() => dispatch({type: 'closeSnackbar'})}>
        <Alert everity="success" onClose={() => dispatch({type: 'closeSnackbar'})}>
          Данные загружены.
        </Alert>
      </Snackbar> 

<Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={state.openSidebar}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => dispatch({type: 'openSidebar'})}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />

        <List>

              <ListItem button key={"h1"} >
                <ListItemIcon></ListItemIcon>
                <ListItemText primary={"Рекомендации по размещению"} />
              </ListItem>
          
            {resultPoints.map((p, index) => (
              <ListItem button key={"res"+index} onClick={() => dispatch({type: 'setResPoint', value: p})}>
                <ListItemIcon><MapIcon /></ListItemIcon>
                <ListItemText primary={"(" + p[0] + ", " + p[1] + ")"} />
              </ListItem>
            ))}
          </List>
      </Drawer>         

    </div>
  );
}

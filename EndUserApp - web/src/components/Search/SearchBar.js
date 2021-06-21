import React, {  useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Box, Grid } from '@material-ui/core';
import useSearchFilter from 'src/hooks/useSearchFilter';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  custwidth:{
    width: 400,
  },
  custLink:{
    cursor:"pointer",
    "&:hover":{
      backgroundColor : "#8080801a"

    }
  }
}));

export default function SearchBar({handleClose}) {
  const classes = useStyles();
  const [placeholderName,setPlaceholderName] = useState("store name")
  const [selectedCategory,setSelectedCategory] = useState("store")
  const [searchResult,setSearchResult] = useState([])
  const [textInput,setTextInput] = useState('')
  const {searchData} = useSearchFilter()
  const navigate = useNavigate()
  const handleChange = (e)=>{
    if(e.key==="Enter"){
      searchByText()
    }else{
      const val = e.target.value === "category" ? `${e.target.value}` : `${e.target.value} name`
      setPlaceholderName(val)
      setSelectedCategory(e.target.value)
    }
    
  }

  const search =async (searchString)=>{
    try {
      setTextInput(searchString)
      if(searchString.length >1){
        const result = await searchData(searchString,selectedCategory)
        console.log(result)
        setSearchResult(result)
      }
      if(!searchString){
        setSearchResult([])
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleClick =(id,storeTypeID=null,category=null)=>{
    var filter=''
    if(storeTypeID){
      id=storeTypeID

    }
    if(category){
      const categoryIndex = category.split('@')[1]
      filter = `&category=${categoryIndex}`
    }
    handleClose(false)
    navigate(`/searchstore/${id}?type=${selectedCategory}${filter}`)
  }
  const searchByText =()=>{
    const searchString = textInput
    console.log(searchString)
    handleClose(false)
    navigate(`/searchstore/all?type=${selectedCategory}&q=${searchString}`)
  }
  const handleKeypress=(e)=>{
    if(e.key==="Enter" && selectedCategory !== "mall") {
      searchByText()
    } 
  }

  return (
    <>
    {/* <Paper component="form" className={classes.root}> */}
    <Paper  className={classes.root}>
      {/* <Autocomplete
        apiKey={GOOGLE_MAP_API_KEY}
        onPlaceSelected={(place) => console.log(place)}
        types={[]}
      /> */}
      <InputBase
        autoFocus={true}
        className={classes.input}
        placeholder={`Enter ${placeholderName}`}
        inputProps={{ 'aria-label': `Enter ${placeholderName}` }}
        onChange={(e)=>search(e.target.value)}
        onKeyPress={e => handleKeypress(e)}
      />
      
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={searchByText}>
      <SearchIcon />
      </IconButton>
      
    </Paper>
    <Box m={1} className={classes.custwidth}>
    <FormControl component="fieldset" >
    <RadioGroup row aria-label="position" name="position" defaultValue="store" onChange={(e)=>handleChange(e)}>
     
      <FormControlLabel value="store" control={<Radio color="primary" />} label="Search by Store Name" />

      <FormControlLabel value="mall" control={<Radio color="primary" />} label="Search by Mall" />
    
      <FormControlLabel value="category" control={<Radio color="primary" />} label="Search by Category" />

    </RadioGroup>
    </FormControl>
    </Box>
    <Divider className={classes.custwidth} orientation="horizontal" />
    <Grid container className={classes.custwidth}>
        <Grid item  xs={12} md={12}>
          
          <Box >
            <List >
              {searchResult.map(item=>(
                <>
                <ListItem key={item._id} className={classes.custLink} disableGutters={true} onClick={()=>handleClick(item._id,item.storeTypeID,item.category)}>
                  
                  <ListItemText
                    primary={item.name || item.mallName}
                    secondary={item.area}
                  />
                </ListItem>
                <Divider className={classes.custwidth} orientation="horizontal" />
                </>
              ))}
                
              
            </List>
          </Box>
        </Grid>
        </Grid>
  </>
  );
}

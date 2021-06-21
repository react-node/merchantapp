import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Typography ,makeStyles,Link} from '@material-ui/core';
import useDashboard from '../hooks/useDashboard'
import { useParams } from 'react-router';
import MenusModel from '../components/MenusModel/MenusModel'
import useMenuModel from 'src/hooks/useMenuModel';
import { Context as GlobalContext } from '../globalContext/globalContext'


const useStyles = makeStyles((theme) => ({
    root: {
        textAlign:"center",
        color:theme.palette.primary.main,
        marginBottom:15,
        paddingTop:5,
        
        flexDirection:"row-reverse",
        [theme.breakpoints.only('xs')]: {
         flexFlow : "inherit",
         overflowY : "auto",
         paddingBottom : 15,
         marginBottom:5,
        },
        
    },
    menuButton:{
    
    },
    menuText:{
        border:"1px solid #a2a194",
        borderRadius:20,
        cursor:"pointer",
        padding: "5px 10px",
        margin: 5,
        whiteSpace: "nowrap",
        "&:hover":{
          color:"#a2a194",
          textDecoration:"none",
          border:`1px solid ${theme.palette.primary.main}`
        }
    
    }
    
  }));
  
const MainMenu = ({id,category}) => {
  console.log("main menu&&&&&&&")
    const classes = useStyles();
    const {getMenu} = useDashboard()
    const {setMenuModel,state} = useContext(GlobalContext)
    const {menuModel} = state
    const [handleClickOpen,handleClose] = useMenuModel()
    const [menuList,setMenuList] = useState([])
    const [menuTitle,setMenuTitle] = useState({typename : "",categoryName: ""})
    const [categories,setCategories] = useState([])
    const getMenuData =async ()=>{
      const menu = await getMenu(id)
      console.log(menu.data)
      if(id){
        setMenuTitle({typename : menu.data[0].type,categoryName: menu.data[0].categories[category] })
        setCategories(menu.data[0].categories)
      }else{
        setMenuList(menu.data)

      }
    }
    const openMenusModel=()=>{
      handleClickOpen()
    }
    useEffect(()=>{
      getMenuData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


  return (
    <>
    <Grid container spacing={1} className={classes.root} >
        {menuList && ( menuList.map((menu)=>(
         <Typography key={menu._id}>
         <Link
             component={RouterLink}
             to={`/offers/${menu._id}`}
            
             className={classes.menuText}
           >
             {menu.type}</Link></Typography>
       )))}
       {categories && (
         categories.length > 6 && (
           <>
          <Typography >
          <Link
              onClick={openMenusModel}
              className={classes.menuText}
            >
              More</Link></Typography>
             <MenusModel 
              open={menuModel}
              handleClose = {handleClose}
              categories={categories}
              type = {id}
             />
              </>
         )
       )}
       {categories && (
         categories.map((item,index)=>(
           (index < 6 && (<Typography key={index}>
            <Link
                component={RouterLink}
                to={`/offers/${id}/${index}`}
                
                className={classes.menuText}
              >
                {item}</Link></Typography>))
          
         ))
         
       )

       }
       
       
    </Grid>  
    {id && <h3>{menuTitle.typename}{category &&  <> =&gt; {menuTitle.categoryName}</>}</h3>}  
                
    </>

  );
};

export default MainMenu;

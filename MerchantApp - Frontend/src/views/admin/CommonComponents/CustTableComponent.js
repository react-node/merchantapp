import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CircularProgress from '@material-ui/core/CircularProgress';
import ConfirmationDialogTwo from "src/views/offer/components/ConfirmationDialogTwo"
import { InputAdornment, SvgIcon, TextField } from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }



function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort,Headers } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all' }}
          />
        </TableCell>
        {Headers.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.key === "status" ? "center" : headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
              {headCell.sort ? (<TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>) : headCell.label

              }
            
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
  searchRoot : {
    paddingLeft:7,
    '& $positionStart' :{marginRight:5},

  },
  positionStart :{marginRight:5},
  custPadd:{ padding:10,paddingLeft:0}
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected,selectedRow,deleteHandling ,Title,tableToolbarOptions,searchHandler,searchPlaceHolder,searchError} = props;
  const [dialogDeleteOpen,setDialogDeleteOpen] = useState(false)
  
  const handleDialogDeleteClose =()=>{
    setDialogDeleteOpen(false)
  }
  const deleteSelectedRow = ()=>{
      console.log("delete record")
      console.log(selectedRow)
      setDialogDeleteOpen(true)
  }
  // const editRow = ()=>{
  //     console.log("edit record")
  //     console.log(selectedRow)
  //     editHandling(selectedRow)

  // }
  // const viewRow = ()=>{
  //   console.log("record details",selectedRow)
  //   viewHandling(selectedRow)
  // }
  const onChangeHandler = (e)=>{
    searchHandler(e.target.value)

  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          {Title}
        </Typography>
      )}
        <TextField
            fullWidth
            error= {!searchError? false : true}
            helperText= {searchError? searchError : ''}
            style={searchError ? {top:5}:{}}
            InputProps={{
              classes: {root : classes.searchRoot,inputAdornedStart: classes.custPadd},
              startAdornment: (
                <InputAdornment classes={{root:classes.positionStart}} position="start" >
                  <SvgIcon
                    fontSize="small"
                    color="action"
                  >
                    <SearchIcon />
                  </SvgIcon>
                </InputAdornment>
              )
            }}
            
            placeholder={searchPlaceHolder || ''}
            variant="outlined"
            onChange = {onChangeHandler}
          />
       {(numSelected > 0 && tableToolbarOptions.includes("delete")) && (
        <Tooltip title="Delete selected rows">
          <IconButton aria-label="delete" onClick={deleteSelectedRow}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
      {/* {(numSelected ===1 && tableToolbarOptions.includes("edit")) && (
        <Tooltip title="Edit Row">
        <IconButton aria-label="edit-row" onClick={editRow}>
        <EditIcon
            className={classes.editIcon}
            color="action"
            
        />
        
        </IconButton>
      </Tooltip>
      )} */}
      {/* {(numSelected ===1 && tableToolbarOptions.includes("view")) && (
        <Tooltip title="Details">
        <IconButton aria-label="view-row" onClick={viewRow}>
        <VisibilityIcon
            className={classes.viewIcon}
            color="action"
            
        />
        
        </IconButton>
      </Tooltip>
      )} */}
      <ConfirmationDialogTwo
                    open={dialogDeleteOpen}
                    handleSubmit = {()=>{setDialogDeleteOpen(false);deleteHandling(selectedRow)}}
                    handleCancel = {handleDialogDeleteClose}
                    message = {` Do you want to delete?`}
                />
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  statusBadge:{
    marginLeft: 10,
    borderRadius: 10,
    padding: 3,
    paddingLeft:15,
    paddingRight:15
  },
  approved:{
    color: "#0e9413",
    backgroundColor: "rgb(76 175 80 / 42%)",
   
  },
  submitted:{
    color: "#3645f4",
    backgroundColor: "rgb(54 95 244 / 42%)",
   
  },
  rejected:{
    color: "#f44336",
    backgroundColor: "rgba(244, 67, 54, 42%)",
  },
  rowPadding : {
    paddingTop:5,
    paddingBottom : 5
  }
}));

export default function EnhancedTable({rows,pageCount,getRows,editHandling,deleteHandling,Headers,Title,tableToolbarOptions,viewHandling,searchHandler,searchPlaceHolder,searchError}) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [tableData, setTabledata] = React.useState([]);
  const [orderBy, setOrderBy] = React.useState('_id');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  //const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(()=>{
    if(rows.length===0){
      rows.push({error:-2, message : "",isLoading:true})
    }
    setTabledata(rows)
    console.log(rows)
  },[rows,page])
  useEffect(()=>{
    console.log("Changed order or orderby....")
    getRows(page+1,rowsPerPage,order,orderBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[order,orderBy])
  
  const editRow = (id)=>{
    console.log("edit record")
    console.log(id)
    editHandling(id)

}
const viewRow = (id)=>{
  console.log("record details",id)
  viewHandling(id)
}
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tableData.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    console.log(newPage)
    setSelected([])
    getRows(newPage+1,rowsPerPage,order,orderBy)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([])
    getRows(1,event.target.value,order,orderBy)
    console.log(event.target.value)
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  //const emptyRows = rowsPerPage - Math.min(rowsPerPage, tableData.length - page * rowsPerPage);
  const generateRow =(rowData,key,numeric,type,actionTypes,index)=>{
    let row = ''
    switch(type){
      case "text":
          row = rowData[key]
         break
      case "action" :
        row = actionTypes.map((t)=>{
          let x;
          if(t === "view") x=  <Tooltip key={t} title="Details">
          <IconButton aria-label="view-row" onClick={()=>viewRow(rowData._id)}>
          <VisibilityIcon
              className={classes.viewIcon}
              color="action"
          />
          </IconButton>
        </Tooltip>
           if(t === "edit") x= <Tooltip key={t} title="Edit Row">
           <IconButton aria-label="edit-row" onClick={()=>editRow(rowData._id)}>
           <EditIcon
               className={classes.editIcon}
               color="action"
           />
           </IconButton>
         </Tooltip>
        //    if(t === "delete") return <Tooltip key={t} title="Delete">
        //    <IconButton aria-label="delete" onClick={deleteSelectedRow}>
        //      <DeleteIcon />
        //    </IconButton>
        //  </Tooltip>
        return x
        })
        break
      case "active" :
          row = rowData[key] === 1 ? 
          <span className={`${classes.submitted} ${classes.statusBadge}`}>Submitted  </span> 
          : rowData[key] === 2 ? 
          <span className={`${classes.approved} ${classes.statusBadge}`}>Approved  </span>
          : <span className={`${classes.rejected} ${classes.statusBadge}`}>Rejected  </span>
          break
      default : 
          break;    
    }
    if(index ===0 ){
      return (<TableCell key={key} component="th"  scope="row" align={numeric ? 'right' : 'left'} padding='none'>
           {row}
         </TableCell>)
    }
    return ( <TableCell classes = {{root : classes.rowPadding}} key={key} align={numeric ? 'right' : 'left'} >
            {row}
      </TableCell>)
  }
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar 
        numSelected={selected.length}
        selectedRow={selected}
        editHandling={editHandling}
        deleteHandling ={deleteHandling}
        viewHandling = {viewHandling}
        Title={Title}
        tableToolbarOptions = {tableToolbarOptions}
        searchHandler ={searchHandler}
        searchPlaceHolder = {searchPlaceHolder}
        searchError = {searchError}
         />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size= 'medium'
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={tableData.length}
              Headers = {Headers}
            />
            <TableBody>
              {tableData.map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  if(row.isLoading ){
                    return (<TableRow
                      key={row.error}>
                      <TableCell colSpan={Headers.length+1} align="center">
                          <CircularProgress align="center"/>
                          </TableCell>
                      </TableRow>
                      )
                  }
                if(row.error === -1){
                  return (<TableRow
                    hover
                    tabIndex={-1}
                    key={row.error}
                  >
                    <TableCell colSpan={Headers.length+1}>
                    {row.message}
                      </TableCell>
                      </TableRow>
                    )
                }
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      {
                          Headers.map(({key,numeric,type,actionTypes},index) => 
                            //   if(index === 0 ){
                            //     return <TableCell key={key} component="th" id={labelId} scope="row" align={numeric ? 'right' : 'left'} >
                            //     {row[key]}
                            //   </TableCell>
                            //   }else{
                            //     return <TableCell key={key} align={numeric ? 'right' : 'left'} >
                            //     {type ==="active" ? (row[key] ? "Active" : "Not Activated") : 
                            //     type==="action" ?  <VisibilityIcon
                            //     className={classes.viewIcon}
                            //     color="action"
                                
                            // /> : row[key]}
                            //   </TableCell>
                            //   }
                            generateRow(row,key,numeric,type,actionTypes,index)
                          )
                      }
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pageCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

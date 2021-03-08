import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import {GlobalContext} from "../../../context/GlobalState"
import Services from "src/services/Services";
import { Link } from "@material-ui/core";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
function EnhancedTableHead(props) {
    var headCells = [
        {
            id: "name",
            numeric: false,
            disablePadding: true,
            label: "Name",
            type : "both"
        },
        { id: "discount", numeric: true, disablePadding: false, label: "Discount" ,type : "offer"},
        { id: "fromDate", numeric: false, disablePadding: false, label: "From Date",type : "offer" },
        { id: "endDate", numeric: false, disablePadding: false, label: "End Date",type : "offer" },
        { id: "slotDetails", numeric: false, disablePadding: false, label: "Slot Details",type : "both" },
        { id: "amount", numeric: true, disablePadding: false, label: "Amount",type : "both" },
        { id: "transactionStatus", numeric: false, disablePadding: false, label: "Transaction Status",type : "both" },
        { id: "transactionID", numeric: false, disablePadding: false, label: "Transaction ID",type : "both" },
        ];
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    type
  } = props;
  const createSortHandler = (property) => (event) => {
    console.log(order,orderBy)
    onRequestSort(event, property);
  };
  if(type=== "banner"){
    headCells = headCells.filter(item => item.type !== "offer") 
    console.log(headCells)
  }
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={"default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
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
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: "1 1 100%"
  }
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));

export default function EnhancedTable({type}) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  //const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  //const [rows, setRows] = React.useState([])
  const { historyData,setLoading,setHistoryData} = useContext(GlobalContext)
  const [open, setOpen] = React.useState(false);
  const [storeAndDates, setStoreAndDates] = React.useState([]);
  console.log(historyData, type)
  
  useEffect(()=>{
    setHistoryData([])
   // setRows([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = historyData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  // const handleClick = (event, name) => {
  //   const selectedIndex = selected.indexOf(name);
  //   let newSelected = [];

  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1)
  //     );
  //   }

  //   setSelected(newSelected);
  // };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const optionName =(name,type)=>{
    if(type==="banner"){
    name  = name.split('/')[1]
    }
    return name
  }
  //const isSelected = (name) => selected.indexOf(name) !== -1;
  const getStoreDetails =async (selectStores)=>{
    try{
      setLoading(true)
      const ids = selectStores.map(item =>  item.id)
    console.log(ids)
    const storeDetails = await Services.getStoresByID(ids)
    var storeDetailsAndDates = []
    storeDetails.data.forEach((item,k)=>{
      selectStores.forEach((val,i)=>{
        if(val.id === item._id){
          storeDetailsAndDates.push({...item,selectedDates : val.selectedDates})
        }
      })


    })
    setStoreAndDates(storeDetailsAndDates)
    
    setOpen(true);
    setLoading(false)
    }catch(e){
      setLoading(false)
    }
    
  }
  const handleClose = () => {
    setOpen(false);
  };
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, historyData.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size= "medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={historyData.length}
              type={type}
            />
            <TableBody>
              {((type === "offer" && historyData.length > 0 && historyData[0].offerDetails) || (type === "banner" && historyData.length > 0  && historyData[0].bannerDetails))
               && stableSort(historyData, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  //const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                     // onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      tabIndex={-1}
                      key={row._id}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        
                      >
                        {type === "offer" ? row.offerDetails.id.offerName : optionName(row.bannerDetails.id.imagePath,"banner") }
                      </TableCell>
                      {type === "offer" && 
                         (<>
                         <TableCell align="right">{row.offerDetails.id.discount}</TableCell>
                         <TableCell align="left">{row.offerDetails.id.fromDate.slice(0, 10)}</TableCell>
                         <TableCell align="left">{row.offerDetails.id.expireDate.slice(0, 10)}</TableCell>
                         </>)
                      }
                      
                      <TableCell align="left" >
                        
                        <Link
                          component="button"
                          variant="body2"
                          color = "secondary"
                          onClick={()=>getStoreDetails(row.selectStores)}
                        >Click Here</Link>
                        </TableCell>
                      <TableCell align="right">{row.totalPaid}</TableCell>
                      <TableCell align="left">{row.txn_response_code === "01" ? "Success" : "Fail"}</TableCell>
                      <TableCell align="left">{row.transactionID}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={historyData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <Modal
        aria-labelledby="store-slot-details"
        aria-describedby="store-slot-details-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Typography id="store-slot-details" align="center">Stores and Reserved Slot Dates</Typography>
            <br />
            <TableContainer component={Paper}>
      <Table className={classes.storeTable} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Store Name</TableCell>
            <TableCell>Area</TableCell>
            <TableCell>Zipcode</TableCell>
            <TableCell >Reserved Slot Dates</TableCell>
           
          </TableRow>
        </TableHead>
        <TableBody>
          {storeAndDates.map((row) => (
            <TableRow key={row._id}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell >{row.zipcode}</TableCell>
              <TableCell>{(row.selectedDates.map(date=>date.slice(0,10))).toString()}</TableCell>
             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

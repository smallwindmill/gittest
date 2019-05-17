import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Snackbar from '@material-ui/core/Snackbar';

import Confirm from './Confirm';
import config from './config';

let counter = 0;
function createData( sId, mCode, mName, indentProcess, proceeDuty, dutySatus) {
  counter += 1;
  return { id: counter, sId, mCode, mName, indentProcess, proceeDuty, dutySatus };
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);

const rows = [
  { id: 'name', numeric: false, disablePadding: true, label: '序号' },
  { id: 'name', numeric: false, disablePadding: true, label: '订单编号' },
  { id: 'name', numeric: false, disablePadding: true, label: '产品编号' },
  { id: 'carbs', numeric: true, disablePadding: false, label: '总生产数量' },
  { id: 'calories', numeric: false, disablePadding: false, label: '总工时' },
  { id: 'calories', numeric: false, disablePadding: false, label: '单数量工时' },
  { id: 'calories', numeric: false, disablePadding: false, label: '权数' },
  { id: 'protein', numeric: true, disablePadding: false, label: '工时费' },
  { id: 'protein', numeric: true, disablePadding: false, label: '总人数' },
  { id: 'protein', numeric: true, disablePadding: false, label: '总小时' }
];

class EnhancedTableHead extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };



  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            (row, index) => (
              <TableCell
                key={'EnhancedTableHead'+index}
                align={row.numeric ? 'left' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
              {row.label}
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.primary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.primary,
  },
  title: {
    flex: '0 0 auto',
  },
});

class EnhancedTableToolbar extends React.Component{

  state = {
    open: false,
    chooseList:[
          {value:0, text:'全部'},
          {value:1, text:'已完成'},
          {value:2, text:'进行中'},
        ],
    dateRange:[{text: "最近一周"},{text: "最近一月"},{text: "最近三月"},{text: "最近一年"},{text: "一年以前"}]
  }

  componentWillMount() {
    // 组件初次加载数据申请

    var queryStart = new Date(new Date()-1000*60*60*24*7).format('yyyy-MM-dd');//一周
    var queryEnd = new Date().format('yyyy-MM-dd');

    fetch(config.server.queryWorkHourByDate+'?startDate='+queryStart+'&endDate='+queryEnd).then(res=>res.json()).then(data=>{
      console.log(data);
      this.props.changeUserData(data.results || []);
    }).catch(e=>this.tips('网络出错了，请稍候再试'));

  }

  handleClose = () => {
    this.setState({ open: false });
  }

  queryWorktimeStatusByDate=(e, data, index)=>{
    var { queryStart, queryEnd } = this.state;
    e.persist();
    // 切换显示高亮
    for(var i of e.target.parentElement.children){
      i.className = i.className.replace('text-blue','');
    }

    e.target.className += ' text-blue';

    queryEnd = new Date().format('yyyy-MM-dd');

    if(index==0){
      queryStart = new Date(new Date()-1000*60*60*24*7).format('yyyy-MM-dd');//一周
    }else if(index==1){
      queryStart = new Date(new Date()-1000*60*60*24*30).format('yyyy-MM-dd');//一月
    }else if(index==2){
      queryStart = new Date(new Date()-1000*60*60*24*90).format('yyyy-MM-dd');//三月
    }else if(index==3){
      queryStart = new Date(new Date()-1000*60*60*24*365).format('yyyy-MM-dd');//一年
    }else if(index==4){
      queryStart = new Date(new Date()-1000*60*60*24*3650).format('yyyy-MM-dd');//一年以前
      queryEnd = new Date(new Date()-1000*60*60*24*365).format('yyyy-MM-dd');
    }

    fetch(config.server.queryWorkHourByDate+'?startDate='+queryStart+'&endDate='+queryEnd).then(res=>res.json()).then(data=>{
      console.log(data);
      this.props.changeWorktimeData(data.results || []);
    }).catch(e=>this.tips('网络出错了，请稍候再试'));

  }


  addTemplate = () => {
    this.setState({ open: true });
  }

  submitFile = () =>{
      if(this.state.fileValue){
        console.log(this.state.fileValue);
      }else{
        this.tips('请选择文件后再上传');
      }
  }

  tips = (msg) => {
    if(msg){
      this.setState({tipInfo:msg});
    }
    this.setState({tipsOpen: true});

    setTimeout(()=>{
      this.setState({tipsOpen: false});
    },1000);
  }


  render(){
    var classes = '';
    var {dateRange} = this.state;
    return (
       <div className={classes.title}>
            <Toolbar >
              <Typography variant="h6" id="tableTitle" align="left">
                {this.state.chooseMonth?this.state.chooseMonth+'月':'所有'}工时
              </Typography>
        </Toolbar>
        <Grid container align="left"  style={{margin:'1rem 0 1rem',padding: '0 1.2rem'}}>
          <Grid item xs={12} className="small">
                <span className="blod">时间</span>
                {dateRange.map((date,index)=>(<span key = {index} className="btn" onClick={(e)=>this.queryWorktimeStatusByDate(e, date, index)}> {date.text}</span>))}
            </Grid></Grid>
          </div>
      )
  }
};



const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});




class QueryWorkTime extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: [
      createData('74475686796','BM234','通用流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",1),
      createData('74475686796','BM234','外协生产流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",0),
      createData('74475686796','BM234','组装流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",0),
      createData('74475686796','BM234','通用流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",1),
      createData('74475686796','BM234','组装流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",0),
      createData('74475686796','BM234','通用流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",0),
      createData('74475686796','BM234','组装流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",1),
      createData('74475686796','BM234','通用流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",0),
      createData('74475686796','BM234','通用流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",0),
    ],
    page: 0,
    rowsPerPage: 10,
    open: true,
    deleteOpen: false,
    title: "确认",
    content: "确定删除该订单吗？"
  };


  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  // 删除用户弹窗
  deleteUser=()=>{
    this.setState({deleteOpen: true})
  }

  // 关闭删除用户弹窗
  deleteModalClose=()=>{
    this.setState({deleteOpen: false})
  }

  changeWorktimeData = (data, type) =>{
    // 默认替换，1为push，2为修改
    if(type==1){
      this.state.data.push(data);
      this.setState({data: this.state.data});
    }else if(type==2){
      this.setState({data: this.state.data});
      // this.state.data[this.state.editNum] = data;
    }else{
      this.setState({data: data});
    }

  }


  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root} style={{padding:"0 2rem",width:"auto"}}>
        <EnhancedTableToolbar changeWorktimeData={this.changeWorktimeData} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              rowCount={data.length}
            />
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell align="left">{n.id}</TableCell>
                      <TableCell align="left">{n.sId}</TableCell>
                      <TableCell align="left">{n.mCode}</TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.mName}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.indentProcess}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.proceeDuty}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {(n.dutySatus)?'已完成':'未完成'}
                      </TableCell>
                      <TableCell align="left">
                        <span className="pointer btn text-blue">修改</span>
                        <span className="pointer btn text-red" onClick={this.deleteUser}>删除</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Confirm open = {this.state.deleteOpen} title = {this.state.title} content={this.state.content} closeFun = {this.deleteModalClose} />
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': '上一页',
          }}
          nextIconButtonProps={{
            'aria-label': '下一页',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

QueryWorkTime.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QueryWorkTime);

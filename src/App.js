import React, { useState } from "react";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import useStyles from "./style";

const App = () => {
  const [open, setOpen] = useState(false);

  const [mode, setMode] = useState(0);

  const [isChange, setisChange] = useState(false);

  const [userData, setUserData] = useState({});

  const [userId, setuserId] = useState("");

  const [userEmail, setuserEmail] = useState("");

  const [userFirstName, setuserFirstName] = useState("");

  const [userLastName, setuserLastName] = useState("");

  const classes = useStyles();

  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleClickAdd = (event) => {
    setOpen(true);
    setMode(1);
    setUserData({});
  };

  const handleClickEdit = (event, rowData) => {
    setOpen(true);
    setMode(2);
    setUserData(rowData);
  };

  const handleClose = () => {
    setOpen(false);
    setMode(0);
    setisChange(false);
  };

  const onChangeHandler = (event) => {
    setisChange(true);
    switch (event.target.id) {
      case "firstname":
        setuserFirstName(event.target.value);
        if (!isChange) {
          setuserEmail(userData.mailid);
          setuserLastName(userData.lastname);
        }
        break;
      case "mailid":
        setuserEmail(event.target.value);
        if (!isChange) {
          setuserFirstName(userData.firstname);
          setuserLastName(userData.lastname);
        }
        break;
      case "lastname":
        setuserLastName(event.target.value);
        if (!isChange) {
          setuserFirstName(userData.firstname);
          setuserEmail(userData.mailid);
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = (formIndex, toIndex) => {
    console.log(formIndex);
    console.log(toIndex);
    let toData = [...data];
    console.log("toData " + toData);
    let fromData = data[formIndex - 1];
    let toDataD = data[toIndex - 1];
    console.log("fromData " + fromData);
    console.log("toDataD " + toDataD);
    toData[formIndex - 1] = toDataD;
    toData[toIndex - 1] = fromData;
    data = [...toData];
    console.log(data);
    handleClose();
  };

  let data = [
    {
      id: 1,
      mailid: "a@b.com",
      firstname: "user1first",
      lastname: "user1last",
    },
    {
      id: 2,
      mailid: "a@asd222.com",
      firstname: "user2first",
      lastname: "user2last",
    },
    {
      id: 3,
      mailid: "a@asd333.com",
      firstname: "user3first",
      lastname: "user3last",
    },
    {
      id: 4,
      mailid: "a@asd444.com",
      firstname: "user4first",
      lastname: "user4last",
    },
    {
      id: 5,
      mailid: "a@asd555.com",
      firstname: "user5first",
      lastname: "user5last",
    },
  ];

  const columns = [
    { title: "Id", field: "id" },
    { title: "Mail Id", field: "mailid" },
    { title: "First Name", field: "firstname" },
    { title: "Last Name", field: "lastname" },
  ];

  return (
    <div>
      <MaterialTable
        title="User Details"
        options={{
          search: false,
          filtering: false,
          sorting: false,
          paging: false,
        }}
        data={data}
        columns={columns}
        actions={[
          {
            icon: "add",
            tooltip: "Add User",
            isFreeAction: true,
            onClick: (event) => handleClickAdd(event),
          },
          {
            icon: "edit",
            tooltip: "Update User",
            onClick: (event, rowData) => handleClickEdit(event, rowData),
          },
          {
            icon: "delete",
            tooltip: "Delete User",
            onClick: (event, rowData) => handleClickEdit(event, rowData),
          },
        ]}
      />
      {/* {open ? <UserDialog user={userData} status={true} /> : null} */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          {mode === 2 ? (
            <TextField
              autoFocus
              margin="dense"
              id="id"
              label="ID"
              fullWidth
              value={userData.id}
            />
          ) : null}
          <TextField
            autoFocus
            margin="dense"
            id="mailid"
            label="Email Address"
            type="email"
            fullWidth
            value={isChange ? userEmail : userData.mailid}
            onChange={(event) => onChangeHandler(event)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="firstname"
            label="First Name"
            fullWidth
            value={isChange ? userFirstName : userData.firstname}
            onChange={(event) => onChangeHandler(event)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="lastname"
            label="Last Name"
            fullWidth
            value={isChange ? userLastName : userData.lastname}
            onChange={(event) => onChangeHandler(event)}
          />
          {mode === 2 ? (
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-helper-label">
                SWAP Ids
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={age}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
              <FormHelperText>Some important helper text</FormHelperText>
            </FormControl>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={(formIndex, toIndex) => handleSubmit(userData.id, 5)}
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default App;

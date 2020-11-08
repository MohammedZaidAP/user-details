import React, { useState, useEffect } from "react";
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
import "react-notifications-component/dist/theme.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import db from "./firebase/firebase";
import "./App.css";

toast.configure();

const App = () => {
  const [open, setOpen] = useState(false);

  const [mode, setMode] = useState(0);

  const [isChange, setisChange] = useState(false);

  const [userData, setUserData] = useState({});

  const [userEmail, setuserEmail] = useState("");

  const [userFirstName, setuserFirstName] = useState("");

  const [userLastName, setuserLastName] = useState("");

  const classes = useStyles();

  const [ids, setIds] = useState("");

  const [validmail, setValidmail] = useState(false);
  const [validFirstName, setValidFirstName] = useState(false);
  const [validLastName, setValidLastName] = useState(false);

  const [users, setUsers] = useState([]);

  const [isLoad, setisLoad] = useState(true);
  const [swap, setSwap] = useState(false);
  const [existingMail, setExistingMail] = useState(false);

  const [disable, setDisable] = useState(false);

  useEffect(() => {
    db.collection("users")
      .doc("Z0UyTfDgC7XRSVc1izGZ")
      .onSnapshot((snapshot) => setUsers(snapshot.data().data));
  }, []);

  useEffect(() => {
    setisLoad(false);
  }, [users]);

  const handleChange = (event, id) => {
    setIds(event.target.value);
    if (event.target.value === id) {
      setSwap(true);
      setDisable(true);
    } else if (event.target.value !== id) {
      setSwap(false);
      setuserEmail(userData.mailid);
      setuserFirstName(userData.firstname);
      setuserLastName(userData.lastname);
      setDisable(true);
    }

    if (event.target.value === "") {
      setDisable(false);
    }
  };

  const handleClickAdd = (event) => {
    if (users.length >= 20) {
      toast("Cannot Perform Add Operation as data exceeds the limit 20", {
        type: "info",
      });
    } else {
      setOpen(true);
      setMode(1);
      setUserData({});
      setuserEmail("");
      setuserFirstName("");
      setuserLastName("");
    }
  };

  const handleClickEdit = (event, rowData) => {
    setOpen(true);
    setMode(2);
    setUserData(rowData);
  };

  const handleClickDelete = (event, rowData) => {
    let insertDB = [...users];

    const indexToBeDeleted = insertDB.findIndex(
      (each) => each.id === rowData.id
    );
    insertDB.splice(indexToBeDeleted, 1);

    db.collection("users").doc("Z0UyTfDgC7XRSVc1izGZ").update({
      data: insertDB,
    });

    toast("Data corresponding to ID has been deleted", {
      type: "success",
    });
  };

  const handleClose = () => {
    setOpen(false);
    setMode(0);
    setisChange(false);
    setValidmail(false);
    setValidFirstName(false);
    setValidLastName(false);
    setDisable(false);
    setIds("");
  };

  const onChangeHandler = (event) => {
    setisChange(true);
    switch (event.target.id) {
      case "firstname":
        setuserFirstName(event.target.value);
        if (!isChange && userData.id) {
          setuserEmail(userData.mailid);
          setuserLastName(userData.lastname);
        }
        break;
      case "mailid":
        setuserEmail(event.target.value);
        if (!isChange && userData.id) {
          setuserFirstName(userData.firstname);
          setuserLastName(userData.lastname);
        }
        break;
      case "lastname":
        setuserLastName(event.target.value);
        if (!isChange && userData.id) {
          setuserFirstName(userData.firstname);
          setuserEmail(userData.mailid);
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = (Id) => {
    if (isChange) {
      let firstNameCheck =
        userFirstName.length > 0 && userFirstName.length < 46;
      let lastNameCheck = userLastName.length > 0 && userLastName.length < 46;
      let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let mailCheck = regex.test(userEmail);
      setValidFirstName(!firstNameCheck);
      setValidLastName(!lastNameCheck);
      setValidmail(!mailCheck);

      if (mailCheck && firstNameCheck && lastNameCheck) {
        let updateDb = [...users];
        let updateDbCheck = [...users];
        const indexToBeIgnored = updateDb.findIndex((each) => each.id === Id);
        updateDbCheck.splice(indexToBeIgnored, 1);
        const existingMail = updateDbCheck.findIndex(
          (each) => each.mailid === userEmail
        );
        if (existingMail === -1) {
          const indexToBeUpdated = updateDb.findIndex((each) => each.id === Id);

          let insDB = {};
          insDB.id = Id;
          insDB.mailid = userEmail;
          insDB.firstname = userFirstName;
          insDB.lastname = userLastName;

          updateDb.splice(indexToBeUpdated, 1);

          db.collection("users").doc("Z0UyTfDgC7XRSVc1izGZ").update({
            data: updateDb,
          });

          updateDb.splice(indexToBeUpdated, 0, insDB);

          db.collection("users").doc("Z0UyTfDgC7XRSVc1izGZ").update({
            data: updateDb,
          });

          toast("Data Updated Successfully", {
            type: "success",
          });

          handleClose(true);
        } else {
          setExistingMail(true);
        }
      }
    } else {
      toast("No Changes to Update", {
        type: "info",
      });
    }
  };

  const handleAddSubmit = () => {
    let firstNameCheck = userFirstName.length > 0 && userFirstName.length < 46;
    let lastNameCheck = userLastName.length > 0 && userLastName.length < 46;
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let mailCheck = regex.test(userEmail);
    setValidFirstName(!firstNameCheck);
    setValidLastName(!lastNameCheck);
    setValidmail(!mailCheck);

    if (mailCheck && firstNameCheck && lastNameCheck) {
      let insertDB = [...users];

      const existingMailIndex = users.findIndex(
        (each) => each.mailid === userEmail
      );
      if (existingMailIndex === -1) {
        let idToBEInserted = Math.max.apply(
          Math,
          users.map(function (each) {
            return each.id;
          })
        );
        if (users.length === 0) {
          idToBEInserted = 0;
        }
        const toDB = {
          id: idToBEInserted + 1,
          mailid: userEmail,
          firstname: userFirstName,
          lastname: userLastName,
        };
        insertDB.push(toDB);

        db.collection("users").doc("Z0UyTfDgC7XRSVc1izGZ").update({
          data: insertDB,
        });
        toast("Data Inserted Successfully", {
          type: "success",
        });
        handleClose(true);
        setuserEmail("");
        setuserFirstName("");
        setuserLastName("");
        setExistingMail(false);
      } else {
        setExistingMail(true);
      }
    }
  };

  const swapData = (frommId, toId) => {
    let infoData = [...users];
    const frommIndex = infoData.findIndex((each) => each.id === frommId);
    const toIndex = infoData.findIndex((each) => each.id === toId);

    [infoData[frommIndex], infoData[toIndex]] = [
      infoData[toIndex],
      infoData[frommIndex],
    ];
    infoData[frommIndex].id = frommId;
    infoData[toIndex].id = toId;
    db.collection("users").doc("Z0UyTfDgC7XRSVc1izGZ").update({
      data: infoData,
    });
    toast("Data Swapped Successfully", {
      type: "success",
    });
    if (!swap) {
      handleClose(true);
    }
  };

  const columns = [
    { title: "Id", field: "id" },
    { title: "Mail Id", field: "mailid" },
    { title: "First Name", field: "firstname" },
    { title: "Last Name", field: "lastname" },
  ];

  return (
    <div className="app">
      <div className="table">
        <MaterialTable
          title="User Details"
          options={{
            search: false,
            filtering: false,
            sorting: false,
            paging: true,
            pageSize: 10,
            actionsColumnIndex: -1,
            rowStyle: {
              backgroundColor: "#EEE",
            },
            headerStyle: {
              backgroundColor: "#01579b",
              color: "#FFF",
            },
          }}
          data={users}
          columns={columns}
          isLoading={isLoad}
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
              onClick: (event, rowData) => handleClickDelete(event, rowData),
            },
          ]}
        />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add User</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter your details here.</DialogContentText>
          {mode === 2 ? (
            <TextField
              autoFocus
              margin="dense"
              id="id"
              disabled={true}
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
            required
            disabled={disable}
            error={validmail || existingMail}
            fullWidth
            helperText={
              validmail
                ? "Email ID is in Incorrect  Format !"
                : existingMail
                ? "Already Email Exists!!"
                : null
            }
            value={isChange ? userEmail : userData.mailid}
            onChange={(event) => onChangeHandler(event)}
          />

          <TextField
            autoFocus
            margin="dense"
            id="firstname"
            label="First Name"
            required
            disabled={disable}
            error={validFirstName}
            fullWidth
            helperText={
              validFirstName ? "First Name should have length 1 - 45" : ""
            }
            value={isChange ? userFirstName : userData.firstname}
            onChange={(event) => onChangeHandler(event)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="lastname"
            label="Last Name"
            required
            disabled={disable}
            error={validLastName}
            fullWidth
            helperText={
              validLastName ? "Last Name should have length 1 - 45" : ""
            }
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
                value={ids}
                error={swap}
                onChange={(event, id) => handleChange(event, userData.id)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {users.map((each) => (
                  <MenuItem key={each.id} value={each.id}>
                    {each.id}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {!swap
                  ? "Select Target ID to for a Data Swap"
                  : "Source and Target Ids are same so cant swap"}
              </FormHelperText>
            </FormControl>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          {mode === 2 ? (
            <Button
              onClick={
                ids !== ""
                  ? (fromId, toId) => swapData(userData.id, ids)
                  : (Id) => handleSubmit(userData.id)
              }
              color="primary"
            >
              {ids !== "" ? "Swap" : "Update"}
            </Button>
          ) : (
            <Button onClick={() => handleAddSubmit()} color="primary">
              Insert
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default App;

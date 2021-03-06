import React, {useEffect, useState, useRef} from "react";
import { useForm } from "react-hook-form";
import '../App.css';
import Axios from 'axios';
import { Modal, Button } from "react-bootstrap";

export default function ProfileUpdate(){

    const [UserPPUpd, setUserPPUpd] = useState('');
    const [UserPwUpd, setUserPwUpd] = useState('');
    const [UserFNUpd, setUserFNUpd] = useState('');
    const [UserSNUpd, setUserSNUpd] = useState('');
    const [UserEmailUpd, setUserEmailUpd] = useState('');

    const [UsersNameList, setUsersNameList] = useState([]);

    const GotUserId = useRef(null);

    const [Message, setMessage] = useState('');
    const [MessageError, setMessageError] = useState('');

    Axios.defaults.withCredentials = true;

    const current = new Date();
    const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm({});

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        formState: {errors: errors2}
    } = useForm({});

    const onSubmit = () => {
        submitUserDataUpd();
        refreshUserData()
        modalClose();
    };

    const onSubmitPw = () => {
        changePassword();
        modalClosePw();
    };

    const password = useRef({});
    password.current = watch("firstPw", "");

    useEffect(() => {
        Axios.get('https://nodejs-server-test-app.herokuapp.com/api/login/user').then((response) => {

            if(response.data.loggedIn === true){
                GotUserId.current = response.data.user[0].UserId;
            }
        }).then(() => {
            Axios.get("https://nodejs-server-test-app.herokuapp.com/api/get/userById",{
            headers: {
                'content-type': "application/json",
                'userIdUpd': GotUserId.current
                }
            }).then((response) => {
                setUsersNameList(response.data)
            })
        });
    }, []);

    const refreshUserData = () => {
        Axios.get("https://nodejs-server-test-app.herokuapp.com/api/get/userById",{
            headers: {
                'content-type': "application/json",
                'userIdUpd': GotUserId.current
                }
            }).then((response) => {
                setUsersNameList(response.data)
            });
    }


    const submitUserDataUpd = () => {
  
        Axios.put(`https://nodejs-server-test-app.herokuapp.com/api/update/user/userId`, { 
        userId: GotUserId.current,
        userPP: UserPPUpd,
        userFN: UserFNUpd,
        userSN: UserSNUpd,
        userEmail: UserEmailUpd,
        userUpdatedAt: date

        }).then((response) => {
            if(response.data.message){
                setMessage(response.data.message)
                handleShowSucUpd()
            }
        }).catch((error) => {
            setMessageError(error.response.data.message);
            handleShowError();
        })
    };

    const changePassword = () => {
        Axios.put('https://nodejs-server-test-app.herokuapp.com/api/update/user/password', {
            userId: GotUserId.current,
            userPw: UserPwUpd,
            userUpdatedAt: date
        }).then((response) => {
            console.log("Updated user password response: " + response)
            setMessage(response.data.message)
            handleShowSucPwUpd()
        }).catch((error) => {
            setMessageError(error.response.data.message);
            handleShowError();
        })
    }

    const [ModalState, setModalState] = useState(false);

    const modalClose = () => setModalState(false);
    const modalOpen = () => setModalState(true);

    const [ModalStatePw, setModalStatePw] = useState(false);

    const modalClosePw = () => setModalStatePw(false);
    const modalOpenPw = () => setModalStatePw(true);

    const [showSucUpd, setShowSucUpd] = useState(false);

    const handleCloseSucUpd = () => setShowSucUpd(false);
    const handleShowSucUpd = () => setShowSucUpd(true);

    const [showSucPwUpd, setShowSucPwUpd] = useState(false);

    const handleCloseSucPwUpd = () => setShowSucPwUpd(false);
    const handleShowSucPwUpd = () => setShowSucPwUpd(true);

    const [showError, setShowError] = useState(false);

    const handleCloseError = () => setShowError(false);
    const handleShowError = () => setShowError(true);

    return(
        <div>
          {UsersNameList.map((val) => {
                      return(
                        <div className="text-center">

                            <div className="card border-primary m-5 shadow-lg">
                            <div className="card-header mb-3">{val.UserUn}'s profile</div>
                            <div className="card-text"><img style={{width: 200, height: 200}} className="card-img-top rounded shadow p-3 mb-5" src={val.UserPP} alt="User profile pic"></img></div>
                            
                                <div className="card-body">
                                    <h5 className="card-title">User name: {val.UserUn}</h5>
                                    <p className="card-text">User first name: {val.UserFN}</p>
                                    <p className="card-text">User second name: {val.UserSN}</p>
                                    <p className="card-text">User date of birth: {val.UserDob}</p>
                                    <p className="card-text">User email: {val.UserEmail}</p>
                                    <p className="card-text">User created at: {val.UserCreatedAt}</p>
                                    <p className="card-text">User updated at: {val.UserUpdatedAt}</p>
                                </div>
                                <div className="card-footer">
                                        <div className="mb-3">
                                            <Button variant="outline-primary" onClick={modalOpenPw}>
                                                Change password
                                            </Button>
                                        </div>

                                        <div>
                                            <Button variant="outline-primary" onClick={modalOpen}>
                                                Edit your profile
                                            </Button>
                                        </div>
                                    </div>
                            </div>

                            <Modal show={ModalStatePw} onHide={modalClosePw}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Changing password</Modal.Title>
                                    </Modal.Header>

                                    <Modal.Body>
                                    <form onSubmit={handleSubmit(onSubmitPw)}>

                                        <div className="form-group">
                                            <label>New password: </label>
                                            <input name="password" type="password" className="form-control" {
                                                ...register("firstPw", {
                                                    required: true,
                                                    minLength: 8,
                                                    maxLength: 16
                                                })
                                            }/>

                                            {errors?.firstPw?.type === "required" && <div><h5>This field is required!</h5><p>Your must have a password!</p></div>}
                                            {errors?.firstPw?.type === "minLength" && <div><h5>Your password is too short.</h5><p>Your password length must be between 8 and 16 characters.</p></div>}
                                            {errors?.firstPw?.type === "maxLength" && <div><h5>Your password is too long.</h5><p>Your password length must be between 8 and 16 characters.</p></div>}
                                        </div>

                                        <div className="form-group">
                                            <label>Password again: </label>
                                            <input type="password" className="form-control" {
                                                ...register("secondPw", {
                                                    validate: value => value === password.current
                                                })
                                            }onChange={(e) => {
                                                setUserPwUpd(e.target.value);
                                            }}/>

                                            {errors?.secondPw?.type === "validate" && <div><h5>Passwords must match!</h5></div>}
                                    
                                        </div>

                                        <div className="mt-5">
                                            <Button type="submit">Submit</Button>
                                        </div>
                                        </form>
                                    </Modal.Body>

                                    <Modal.Footer>
                                        <Button variant="outline-secondary" onClick={modalClosePw}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

                                <Modal show={ModalState} onHide={modalClose}>
                                <Modal.Header closeButton>
                                  <Modal.Title>Editing {val.UserUn}'s profile</Modal.Title>
                                </Modal.Header>

                              <Modal.Body>
                              {UsersNameList.map((val) => {
                                return(
                                    <form onSubmit={handleSubmit2(onSubmit)}>
        
                                    <div className="form-group">
                                        <label>User name:</label>
                                        <input type="text" className="form-control" disabled={true} placeholder={val.UserUn}></input>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>User profile picture:</label>
                                        <input type="url" className="form-control" defaultValue={val.UserPP}{
                                            ...register2("userPPUpd", {
                                                minLength: 10,
                                                maxLength: 1000,
                                            })
                                        }onChange={(e) => {
                                            setUserPPUpd(e.target.value);
                                        }}/>
                        
                                        {errors2?.userPPUpd?.type === "minLength" && <div><h5>The URL is too short.</h5><p>Your URL length must be between 10 and 1000 characters.</p></div>}
                                        {errors2?.userPPUpd?.type === "maxLength" && <div><h5>The URL is too long.</h5><p>Your URL length must be between 10 and 1000 characters.</p></div>}
                                    </div>
                        
                                    <div className="form-group">
                                        <label>User password:</label>
                                        <input type="text" className="form-control" disabled={true} placeholder="You can not change your password here"></input>
                                    </div>
                        
                                    <div className="form-group">
                                        <label>User first name:</label>
                                        <input type="text" className="form-control" defaultValue={val.UserFN}{
                                            ...register2("userFNUpd", {
                                                required: false,
                                                minLength: 3,
                                                maxLength: 20,
                                            })
                                        }onChange={(e) => {
                                            setUserFNUpd(e.target.value);
                                        }}/>
                        
                                        {errors2?.userFNUpd?.type === "minLength" && <div><h5>Your first name is too short.</h5><p>Your first name length must be between 3 and 20 characters.</p></div>}
                                        {errors2?.userFNUpd?.type === "maxLength" && <div><h5>Your first name is too long.</h5><p>Your first name length must be between 3 and 20 characters.</p></div>}
                                    </div>
                        
                                    <div className="form-group">
                                        <label>User second name:</label>
                                        <input type="text" className="form-control" defaultValue={val.UserSN}{
                                            ...register2("userSNUpd", {
                                                required: false,
                                                minLength: 3,
                                                maxLength: 20,
                                            })
                                        }onChange={(e) => {
                                            setUserSNUpd(e.target.value);
                                        }}/>
                        
                                        {errors2?.userSNUpd?.type === "minLength" && <div><h5>Your second name is too short.</h5><p>Your second name length must be between 3 and 20 characters.</p></div>}
                                        {errors2?.userSNUpd?.type === "maxLength" && <div><h5>Your second name is too long.</h5><p>Your second name length must be between 3 and 20 characters.</p></div>}
                                    </div>
                        
                                    <div className="form-group">
                                        <label>User email: </label>
                                        <input type="email" className="form-control" defaultValue={val.UserEmail}{
                                            ...register2("userEmailUpd", {
                                                required: false,
                                                minLength: 12,
                                                maxLength: 40,
                                                pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                                            })
                                        }onChange={(e) => {
                                            setUserEmailUpd(e.target.value);
                                        }}/>

                                        {errors2?.userEmailUpd?.type === "minLength" && <div><h5>Your email's length is too short.</h5><p>Your email must exceed 12 characters.</p></div>}
                                        {errors2?.userEmailUpd?.type === "maxLength" && <div><h5>Your email's length is too long.</h5><p>Your email must not exceed 40 characters.</p></div>}
                                        {errors2?.userEmailUpd?.type === "pattern" && <div><ul>
                                                <li>Uppercase (A-Z) and lowercase (a-z) English letters</li>
                                                <li>Digits (0-9)</li>
                                                <li>Do not use any special characters</li>
                                                <li>Character . ( period, dot or fullstop) provided that it is not the first or last character and it will not come one after the other</li>
                                            </ul>
                                        </div>}
                                    </div>
                        
                                    <div className="mt-5">
                                        <Button type="submit" onClick={() => {
                                            if(UserPPUpd === ""){setUserPPUpd(val.UserPP)}
                                            if(UserFNUpd === ""){setUserFNUpd(val.UserFN)}
                                            if(UserSNUpd === ""){setUserSNUpd(val.UserSN)}
                                            if(UserEmailUpd === ""){setUserEmailUpd(val.UserEmail)}
                                        }}>Submit</Button>
                                    </div>
                                </form>
                                  ) 
                                })}
                              </Modal.Body>
                            
                              <Modal.Footer>
                                <Button variant="outline-secondary" onClick={modalClose}>
                                  Close
                                </Button>
                            </Modal.Footer>
                          </Modal>
                        </div>
                      )
                  })}

            <Modal show={showSucUpd} onHide={handleCloseSucUpd}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>{Message}</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseSucUpd}>
                    Ok
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showSucPwUpd} onHide={handleCloseSucPwUpd}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>{Message}</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseSucPwUpd}>
                    Ok
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal  show={showError} onHide={handleCloseError}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{MessageError}</Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={() => {handleCloseError();}}>
                    Ok
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

export default function ProfileScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
        
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    // getting user information from redux store
    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;
    // get user update profile information from redux store
    const userUpdateProfile = useSelector(state => state.userUpdateProfile);
    const {
        success: successUpdate,
        error: errorUpdate,
        loading: loadingUpdate
    } = userUpdateProfile;
    
    const dispatch = useDispatch();
    
    useEffect(() => {
        if(!user) {
            // reset success update when we open the profile screen for the second time
            dispatch({type: USER_UPDATE_PROFILE_RESET});

            // passing user id as a parameter
            // for detailsUser which is an action
            // in user actions
            dispatch(detailsUser(userInfo._id));
        } else {
            // fill name, email with data from backend
            setName(user.name);
            setEmail(user.email);
        }
    }, [dispatch, userInfo._id, user])
    
    
    // define submit handler function
    const submitHandler = (e) => {
        e.preventDefault();
        // dispatch update profile
        if(password !== confirmPassword) {
            alert('Password and Confirm Password do not match!')
        } else {
            dispatch(updateUserProfile({userId: user._id, name, email, password }));
        }
    };

    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>User Profile</h1>
                </div>
                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <>
                    {loadingUpdate && <LoadingBox></LoadingBox>}
                    {errorUpdate && (
                    <MessageBox variant="danger">{errorUpdate}</MessageBox>
                    )}
                    {successUpdate && <MessageBox variant="success">
                        Profile updated successfully</MessageBox>}

                        <div>
                            <label htmlFor="name">Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter name"
                                value={name} // name = state in this component
                                onChange={(e) => setName(e.target.value)}
                                ></input>
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="text"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                ></input>
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                onChange={(e) => setPassword(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Enter confirm password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            ></input>
                        </div>
                        <div>
                          <label/>
                          <button className="primary" type="submit">Update profile</button>  
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}

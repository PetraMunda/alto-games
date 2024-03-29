import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, listUsers } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_DETAILS_RESET } from '../constants/userConstants';

export default function UserListScreen(props) {
    const userList = useSelector((state) => state.userList);
    const { loading, error, users } = userList;
    // actions for refreshing list after deleting user
    const userDelete = useSelector((state) => state.userDelete);
    const {
      loading: loadingDelete,
      error: errorDelete,
      success: successDelete,
    } = userDelete;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(listUsers());
        dispatch({
            type: USER_DETAILS_RESET,});
        }, [dispatch, successDelete]);
        const deleteHandler = (user) => {
        if (window.confirm('Are you sure?')) {
        dispatch(deleteUser(user._id));
        }
    };

    return (
        <div>
            <h1>Users</h1>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
            {successDelete && (
                <MessageBox variant="success">User Deleted Successfully</MessageBox>
                )}

            {
            loading ? (<LoadingBox></LoadingBox>)
            :
            error ? (<MessageBox variant="danger">{error}</MessageBox>)
            :
            (
                <table className="table">
                    <thead>
                        <tr>
                            <th><b>ID</b></th>
                            <th><b>NAME</b></th>
                            <th><b>EMAIL</b></th>
                            <th><b>IS EMPLOYED</b></th>
                            <th><b>IS ADMIN</b></th>
                            <th><b>ACTIONS</b></th>
                        </tr>
                    </thead>
                        <tbody>
                            {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isEmployer? 'YES' : 'NO' }</td>
                                <td>{user.isAdmin? 'YES' : 'NO' }</td>
                                <td>
                                <button type="button"
                                    className="small"
                                    onClick={() => props.history.push(`/user/${user._id}/edit`)}
                                    >Edit</button>
                                <button
                                    type="button"
                                    className="small"
                                    onClick={() => deleteHandler(user)}
                                    >Delete</button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                </table>
            )
            }
        </div>
    )
}

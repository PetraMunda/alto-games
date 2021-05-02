import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function UserListScreen() {
    const userList = useSelector((state) => state.userList);
    const { loading, error, users } = userList;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(listUsers());
    }, [])
    return (
        <div>
            <h1>Users</h1>
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
                                <button>Edit</button>
                                <button>Delete</button>
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

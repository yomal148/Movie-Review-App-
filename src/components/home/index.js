import React, { useEffect, useState } from "react";
import Movie from "./movie";
import "./index.css";
import axios from "axios";
import UserTile from "./user-tile";
import isLoggedIn from "../../global/variables";
import {Link, useNavigate} from "react-router-dom";

const api = axios.create({
    withCredentials: true
});

const Home = () => {
    const url =
        "https://api.themoviedb.org/3/movie/popular?api_key=9e019a5736bc48ae537fdcff22fd8a1e&language=en-US&page=1";
    const [popular, setPopular] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        fetchPopular();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const fetchPopular = async () => {
        const data = await fetch(url);
        const movies = await data.json();
        console.log(movies);
        setPopular(movies.results);
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get("http://localhost:4000/api/users")
            setUsers(response.data)
        } catch (e) {
            alert(e)
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const response = await api.post("http://localhost:4000/api/profile")
            setCurrentUser(response.data)
        } catch (e) {
            // no user logged in
        }
    }

    const addLike = async ({liked}) => {
        try {
            await api.put(`http://localhost:4000/api/users/${currentUser._id}`, {
                ...currentUser,
                likedMovies: [...currentUser.likedMovies, liked]
            })
        } catch (e) {
            console.log(e)
        }
        navigate('/signin')
    }

    return (
        <div className="mt-5">
            <div className={'row'}>
                <div className={'col-9'}>
                    {
                        isLoggedIn.LOGGED_IN &&
                            <div>
                                <h1>My Likes</h1>
                                {JSON.stringify(currentUser.likedMovies)}
                            </div>
                    }

                    <h1>Movies Featured Today</h1>
                    <div className="popular-movies">
                        {popular.map((movie) => {

                            return <div>
                                <Link to={`/details/${movie.id}`}>
                                    <Movie key={movie.id} movie={movie} />
                                </Link>
                                {
                                    isLoggedIn.LOGGED_IN &&
                                        <button className={'btn btn-primary'}
                                        onClick={() => addLike(movie.id)}>
                                            Like
                                        </button>
                                }
                                {
                                    !isLoggedIn.LOGGED_IN &&
                                    <button className={'btn btn-primary'}
                                            onClick={() => navigate('/signin')}>
                                        Like
                                    </button>
                                }
                            </div>
                        })}
                    </div>
                </div>
                <div className={'col-3'}>
                    <div>
                        {
                            isLoggedIn.LOGGED_IN &&
                        <div className={'row'}>
                            <div className={'col-3 pt-3 ps-3 pe-3'}>
                                <img src={'./images/default-user-image.png'} className={'wd-profile-picture'}/>
                            </div>
                            <div className={'col-9 pt-3 ps-3 pe-3'}>
                                <h3>{`@${currentUser.username}`}</h3>
                            </div>
                            <hr className={'m-2'}/>
                        </div>
                        }

                        <h4 className={'mt-2'}>Recently Joined</h4>
                        <ul className={'list-group'}>
                            {users.reverse().map((user) => <UserTile user={user}/>)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Home;
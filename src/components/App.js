import React, { useState, useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Launcher from "./Launcher";
import Redirect from "./Redirect";
import fire from '../Login/fire'
import Login from '../Login/Login'

 const App = () => {
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [hasAccount, setHasAccount] = useState(false);

    const clearInputs = () => {
        setEmail('');
        setPassword('');
    }

    const clearErrors = () => {
        setEmailError('');
        setPasswordError('');
    }

    const handleLogin = () => {
        clearErrors();
        fire    
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(err => {
                switch(err.code) {
                    case "auth/invalid-email":
                    case "auth/user-disabled":
                    case "auth/user-not-found":
                        setEmailError(err.message);
                        break;
                    case "auth/wrong-password":
                        setPasswordError(err.message);
                        break;
                }
            })
    }

    const handleSignup = () => {
        clearErrors();
        fire    
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .catch(err => {
            switch(err.code) {
                case "auth/email-already-in-use":
                case "auth/invalid-email":
                    setEmailError(err.message);
                    break;
                case "auth/weak-password":
                    setPasswordError(err.message);
                    break;
            }
        })
    }

    const handleLogout = () => {
        fire.auth().signOut();
    }

    const authListener = () => {
        fire.auth().onAuthStateChanged(user => {
            if(user) {
                clearInputs(); //everything when we login or signup, we need to clear the input
                setUser(user);
            } else {
                setUser("");
            }
        })
    }

    useEffect(() => {
        authListener();
    }, [])

    return (
        <div>
            {user ? (
                <BrowserRouter>
                <section>
                <h2>Welcome to Unite Genomics</h2>
                    <nav>
                        <Route path="/redirect" component={Redirect} />
                        <Route path="/" component={Launcher} exact />
                    </nav>
                    <button onClick = {handleLogout}>Logout</button>
                </section>
                </BrowserRouter>

            ) : (
                <Login
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
                handleSignup={handleSignup}
                hasAccount={hasAccount}
                setHasAccount={setHasAccount}
                emailError={emailError}
                passwordError={passwordError}
                />

            )}

        </div>
    );
}

export default App;

//        





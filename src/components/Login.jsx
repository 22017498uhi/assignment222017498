//import firebase from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


function Login() {
    return (
        <div style={{ display: 'flex', flex: 1, height: '100vh' }}>
            <div style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: 300
            }}>
               
                <div>

                <button className="btn btn-primary" onClick={async () => {
                    const auth = getAuth();
                    const provider = new GoogleAuthProvider();
                    signInWithPopup(auth, provider);

                }}>
                    <span className="login-btn-image"><img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" /></span><span>Login with Google</span>
                </button>
                </div>

            </div>
        </div>
    )
}

export default Login;
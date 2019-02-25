import React, { FunctionComponent, useRef, useState, useContext } from "react";
import { loadCurrentModule } from "reactStartup";
import { AjaxButton } from "applicationRoot/components/bootstrapButton";
import ajaxUtil from "util/ajaxUtil";
import { AppContext } from "applicationRoot/renderUI";

const errorCodes = {
  s1: "This user already exists",
  c1: "Passwords do not match",
  c2: "No login found for this Email / Password",
  c3: "Password is required"
};

const Login: FunctionComponent<{}> = props => {
  const [{}, { newLogin }] = useContext(AppContext);
  const usernameEl = useRef(null);
  const passwordEl = useRef(null);
  const rememberMeEl = useRef(null);
  const confirmPasswordEl = useRef(null);

  const [state, setState] = useState({ newUser: false, errorCode: null, pendingActivation: false, invalidEmail: false, running: false });

  const login = evt => {
    evt.preventDefault();

    let username = usernameEl.current.value;
    let password = passwordEl.current.value;
    let rememberme = rememberMeEl.current.checked ? 1 : 0;

    setState({ ...state, running: true });
    ajaxUtil.post(
      "/react-redux/login",
      { username, password, rememberme },
      () => {
        newLogin();
        loadCurrentModule();
      },
      () => setState(state => ({ ...state, running: false, errorCode: "c2" }))
    );
  };
  const createUser = evt => {
    evt.preventDefault();

    let username = usernameEl.current.value,
      password = passwordEl.current.value,
      confirmPassword = confirmPasswordEl.current.value,
      rememberme = rememberMeEl.current.checked ? 1 : 0;

    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(username)) {
      return setState({ ...state, invalidEmail: true });
    }

    if (password !== confirmPassword) {
      setState({ ...state, errorCode: "c1" });
      return;
    } else if (!password) {
      setState({ ...state, errorCode: "c3" });
      return;
    } else {
      setState({ ...state, errorCode: null });
    }

    setState({ ...state, running: true });
    ajaxUtil.post("/react-redux/createUser", { username, password, rememberme }, resp => {
      if (resp.errorCode) {
        setState(state => ({ ...state, errorCode: resp.errorCode, running: false }));
      } else {
        setState(state => ({ ...state, pendingActivation: true }));
      }
    });
  };
  const switchToLogin = () => {
    setState(state => ({ ...state, newUser: false, errorCode: null, invalidEmail: false }));
  };
  const switchToCreate = () => {
    setState(state => ({ ...state, newUser: true, errorCode: null, invalidEmail: false }));
  };

  return (
    <div>
      <div style={{ padding: 50, maxWidth: 700, marginRight: "auto", marginLeft: "auto" }}>
        <div className="panel panel-default">
          <div className="panel-body">
            {state.pendingActivation ? (
              <div className="alert alert-success">
                Success! Now check your email, please. You should be receiving a link to activate your account. (Check your spam folder if it's not
                there)
              </div>
            ) : (
              <form>
                <div className="form-group">
                  <label htmlFor="username">Email address</label>
                  <input className="form-control" ref="username" id="username" />

                  {state.newUser ? (
                    <div className="alert alert-info margin-top">
                      Your email address will never ever be sold, given away, etc. I will not send you anything, ever. I'm collecting it only so I
                      have a place to send a password reset to.
                    </div>
                  ) : null}

                  {state.invalidEmail ? <div className="alert alert-danger margin-top">Invalid email</div> : null}
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input className="form-control" ref="password" id="password" type="password" />
                </div>

                {state.newUser ? (
                  <div className="form-group">
                    <label htmlFor="password">Confirm password</label>
                    <input className="form-control" ref="confirmPassword" type="password" />
                  </div>
                ) : null}

                <div className="checkbox">
                  <label>
                    <input type="checkbox" ref="rememberme" /> Remember me
                  </label>
                </div>
                {state.newUser ? (
                  <AjaxButton onClick={evt => createUser(evt)} running={state.running} preset="primary">
                    Create user
                  </AjaxButton>
                ) : (
                  <AjaxButton onClick={evt => login(evt)} running={state.running} preset="primary">
                    Login
                  </AjaxButton>
                )}

                {state.errorCode ? <div className="alert alert-danger margin-top">{errorCodes[state.errorCode]}</div> : null}
                <hr />

                {state.newUser ? (
                  <div className="form-group">
                    <h4>Existing user?</h4>
                    <a onClick={() => switchToLogin()} className="btn btn-info">
                      Click to login
                    </a>
                  </div>
                ) : (
                  <div className="form-group">
                    <h4>New user?</h4>
                    <a onClick={() => switchToCreate()} className="btn btn-info">
                      Click to create account
                    </a>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

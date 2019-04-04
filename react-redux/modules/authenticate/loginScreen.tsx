import React, { FunctionComponent, useRef, useState, useContext, useEffect } from "react";
import { loadCurrentModule } from "reactStartup";
import { AjaxButton } from "applicationRoot/components/bootstrapButton";
import ajaxUtil from "util/ajaxUtil";
import { AppContext } from "applicationRoot/renderUI";

const errorCodes = {
  s1: "This user already exists",
  c1: "Passwords do not match",
  c2: "No login found for this Email / Password",
  c3: "Password is required",
  c4: "Email is required"
};

const Login: FunctionComponent<{}> = props => {
  const [{}, appActions] = useContext(AppContext);
  const usernameEl = useRef(null);
  const passwordEl = useRef(null);
  const rememberMeEl = useRef(null);
  const confirmPasswordEl = useRef(null);

  const [state, setState] = useState({ newUser: false, errorCode: null, pendingActivation: false, invalidEmail: false, running: false });
  const [app, actions] = useContext(AppContext);
  useEffect(() => {
    loadCurrentModule(app, appActions);
  }, [app.userId]);

  const login = evt => {
    evt.preventDefault();

    let username = usernameEl.current.value;
    let password = passwordEl.current.value;
    let rememberme = rememberMeEl.current.checked ? 1 : 0;

    if (!username) {
      return setState(state => ({ ...state, errorCode: "c4" }));
    } else if (!password) {
      return setState(state => ({ ...state, errorCode: "c3" }));
    } else {
      setState(state => ({ ...state, errorCode: null }));
    }

    setState(state => ({ ...state, running: true }));
    ajaxUtil.post(
      "/react-redux/login",
      { username, password, rememberme },
      () => appActions.newLogin(),
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
      return setState(state => ({ ...state, invalidEmail: true }));
    } else {
      setState(state => ({ ...state, invalidEmail: false }));
    }

    if (password !== confirmPassword) {
      setState(state => ({ ...state, errorCode: "c1" }));
      return;
    } else if (!password) {
      setState(state => ({ ...state, errorCode: "c3" }));
      return;
    } else {
      setState(state => ({ ...state, errorCode: null }));
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
  const switchToLogin = evt => {
    evt.preventDefault();
    setState(state => ({ ...state, newUser: false, errorCode: null, invalidEmail: false }));
  };
  const switchToCreate = evt => {
    evt.preventDefault();
    setState(state => ({ ...state, newUser: true, errorCode: null, invalidEmail: false }));
  };

  const emailError = state.errorCode && state.errorCode == "c4";
  const pwdError = state.errorCode && (state.errorCode == "c1" || state.errorCode == "c3");
  const miscError = state.errorCode && !emailError && !pwdError;

  return (
    <div>
      <div style={{ padding: 50, maxWidth: 700, marginRight: "auto", marginLeft: "auto" }}>
        <div>
          <div>
            {state.pendingActivation ? (
              <div className="alert alert-success">
                Success! Now check your email, please. You should be receiving a link to activate your account. (Check your spam folder if it's not
                there)
              </div>
            ) : (
              <form>
                <div className="form-group">
                  <label htmlFor="username">Email address</label>
                  <input className="form-control" ref={usernameEl} id="username" />

                  {state.newUser ? (
                    <div className="alert alert-info margin-top">
                      Your email address will never ever be sold, given away, etc. I will not send you anything, ever. I'm collecting it only so I
                      have a place to send a password reset to.
                    </div>
                  ) : null}

                  {state.invalidEmail ? <div className="alert alert-danger margin-top">Invalid email</div> : null}
                  {emailError ? <div className="alert alert-danger margin-top margin-bottom">{errorCodes[state.errorCode]}</div> : null}
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input className="form-control" ref={passwordEl} id="password" type="password" />
                </div>

                {state.newUser ? (
                  <div className="form-group">
                    <label htmlFor="password">Confirm password</label>
                    <input className="form-control" ref={confirmPasswordEl} type="password" />
                  </div>
                ) : null}

                {pwdError ? <div className="alert alert-danger margin-top margin-bottom">{errorCodes[state.errorCode]}</div> : null}

                <div className="checkbox">
                  <label>
                    <input type="checkbox" ref={rememberMeEl} /> Remember me
                  </label>
                </div>
                {state.newUser ? (
                  <AjaxButton onClick={evt => createUser(evt)} running={state.running} preset="primary" className="margin-top margin-bottom">
                    Create user
                  </AjaxButton>
                ) : (
                  <AjaxButton onClick={evt => login(evt)} running={state.running} preset="primary" className="margin-top margin-bottom">
                    Login
                  </AjaxButton>
                )}

                {miscError ? <div className="alert alert-danger margin-bottom">{errorCodes[state.errorCode]}</div> : null}
                <hr />

                {state.newUser ? (
                  <div className="form-group">
                    <h4>Existing user?</h4>
                    <button onClick={evt => switchToLogin(evt)} className="btn btn-info margin-top margin-bottom">
                      Click to login
                    </button>
                  </div>
                ) : (
                  <div className="form-group">
                    <h4>New user?</h4>
                    <button onClick={evt => switchToCreate(evt)} className="btn btn-info margin-top">
                      Click to create account
                    </button>
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

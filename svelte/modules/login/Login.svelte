<script lang="ts">
  import ActionButton from "app/components/buttons/ActionButton.svelte";
  import Stack from "app/components/layout/Stack.svelte";

  import ajaxUtil from "util/ajaxUtil";
  //import Stack from "app/components/layout/Stack";
  const errorCodes = {
    s1: "This user already exists",
    c1: "Passwords do not match",
    c2: "No login found for this Email / Password",
    c3: "Password is required",
    c4: "Email is required"
  };

  let username = "";
  let password = "";
  let rememberme = false;
  let confirmPassword = "";

  let state = { newUser: false, errorCode: null, pendingActivation: false, invalidEmail: false, running: false };
  const setState = fn => (state = fn(state));

  $: emailError = state.errorCode && state.errorCode == "c4";
  $: pwdError = state.errorCode && (state.errorCode == "c1" || state.errorCode == "c3");
  $: miscError = state.errorCode && !emailError && !pwdError;

  const login = evt => {
    evt.preventDefault();

    if (!username) {
      return setState(state => ({ ...state, errorCode: "c4" }));
    } else if (!password) {
      return setState(state => ({ ...state, errorCode: "c3" }));
    } else {
      setState(state => ({ ...state, errorCode: null }));
    }

    setState(state => ({ ...state, running: true }));
    return new Promise(res => {
      ajaxUtil.postAuth(
        "/login",
        { username, password, rememberme },
        () => window.location.replace("/"),
        () => {
          setState(state => ({ ...state, running: false, errorCode: "c2" }));
          res(true);
        }
      );
    });
  };
  const createUser = evt => {
    evt.preventDefault();

    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(username)) {
      return setState(state => ({ ...state, invalidEmail: true }));
    } else {
      setState(state => ({ ...state, invalidEmail: false }));
    }

    if (password !== confirmPassword) {
      return setState(state => ({ ...state, errorCode: "c1" }));
    } else if (!password) {
      return setState(state => ({ ...state, errorCode: "c3" }));
    } else {
      setState(state => ({ ...state, errorCode: null }));
    }

    setState(() => ({ ...state, running: true }));
    return ajaxUtil.postAuth("/createUser", { username, password, rememberme }, resp => {
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
</script>

<section>
  <div style="padding: 50px; max-width: 700px; margin-right: auto; margin-left: auto">
    <div>
      <div>
        {#if state.pendingActivation}
          <div class="alert alert-success">
            Success! Now check your email. You should be receiving a link to activate your account. (Check your spam folder if it's not there)
          </div>
        {:else}
          <form>
            <Stack>
              <div class="form-group">
                <label for="username">Email address</label>
                <input bind:value={username} class="form-control" id="username" />

                {#if state.newUser}
                  <div class="alert alert-info margin-top">
                    Your email address will never ever be sold, given away, etc. I will not send you anything, ever. I'm collecting it only so I have
                    a place to send a password reset to.
                  </div>
                {/if}

                {#if state.invalidEmail}
                  <div class="alert alert-danger margin-top">Invalid email</div>
                {/if}
                {#if emailError}
                  <div class="alert alert-danger margin-top margin-bottom">{errorCodes[state.errorCode]}</div>
                {/if}
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input bind:value={password} class="form-control" id="password" type="password" />
              </div>

              {#if state.newUser}
                <div class="form-group">
                  <label for="password">Confirm password</label>
                  <input bind:value={confirmPassword} class="form-control" type="password" />
                </div>
              {/if}

              {#if pwdError}
                <div class="alert alert-danger margin-top margin-bottom">{errorCodes[state.errorCode]}</div>
              {/if}

              <div class="checkbox"><label> <input bind:checked={rememberme} type="checkbox" /> Remember me </label></div>
              {#if state.newUser}
                <ActionButton text="Create user" onClick={createUser} preset="primary" class="margin-top margin-bottom" />
              {:else}
                <ActionButton text="Login" onClick={login} preset="primary" class="margin-top margin-bottom" />
              {/if}
            </Stack>

            {#if miscError}
              <div class="alert alert-danger margin-bottom">{errorCodes[state.errorCode]}</div>
            {/if}
            <hr />

            {#if state.newUser}
              <div class="form-group">
                <h4>Existing user?</h4>
                <button on:click={switchToLogin} class="btn btn-info margin-top margin-bottom">Click to login</button>
              </div>
            {:else}
              <div class="form-group">
                <h4>New user?</h4>
                <button on:click={switchToCreate} class="btn btn-info margin-top">Click to create account</button>
              </div>
            {/if}
          </form>
        {/if}
      </div>
    </div>
  </div>
</section>

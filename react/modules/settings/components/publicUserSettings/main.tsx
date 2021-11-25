import React, { FunctionComponent, useContext, useState, useRef } from "react";

import PublicUserSettingsQuery from "graphQL/settings/getPublisUserSettingsQuery.graphql";
import UpdatePublisUserSettingsMutation from "graphQL/settings/updatePublicUserSettings.graphql";
import { useSuspenseQuery, useMutation } from "micro-graphql-react";
import { AppContext } from "app/state/appState";
import { QueryOf, Queries, MutationOf, Mutations } from "graphQL/graphql-typings";
import FlexRow from "app/components/layout/FlexRow";
import Stack from "app/components/layout/Stack";

import { Form, Input, SubmitButton, required } from "app/components/ui/Form";
import { clearCache } from "util/graphqlCacheHelpers";

const PublicUserSettings: FunctionComponent<{}> = props => {
  const [{ online }] = useContext(AppContext);
  const { loaded, data } = useSuspenseQuery<QueryOf<Queries["getUser"]>>(PublicUserSettingsQuery, {}, { active: online });

  if (!online) {
    return <h1>Offline</h1>;
  }

  return (
    <div>
      <FlexRow>
        <div className="col-md-6 col-sm-12" style={{ position: "relative", minHeight: "200px" }}>
          {!loaded ? null : <EditPublicUserSettings settings={data.getUser.User} />}
        </div>
      </FlexRow>
    </div>
  );
};

interface UserSettings {
  isPublic: boolean;
  publicBooksHeader: string;
  publicName: string;
}

const EditPublicUserSettings: FunctionComponent<{ settings: UserSettings }> = props => {
  const [app] = useContext(AppContext);
  const { runMutation, running: saving } = useMutation<MutationOf<Mutations["updateUser"]>>(UpdatePublisUserSettingsMutation);
  const { settings } = props;
  const { publicBooksHeader, publicName } = settings;
  const [pendingIsPublic, setPendingIsPublic] = useState(settings.isPublic);
  const [isPublic, setIsPublic] = useState(settings.isPublic);

  const publicLink = isPublic ? `http://${window.location.host}/view?userId=${app.userId}` : "";

  const pubNameEl = useRef(null);
  const pubHeaderEl = useRef(null);

  const update = () => {
    let isPublic = pendingIsPublic;
    return runMutation({
      isPublic: pendingIsPublic,
      publicBooksHeader: pubHeaderEl.current ? pubHeaderEl.current.value : "",
      publicName: pubNameEl.current ? pubNameEl.current.value : ""
    }).then(() => {
      setIsPublic(isPublic);
      clearCache(PublicUserSettingsQuery);
    });
  };

  return (
    <Stack looser={true}>
      {publicLink ? (
        <div>
          Your collection is currently public, viewable{" "}
          <a target="_blank" href={publicLink}>
            here
          </a>
        </div>
      ) : null}

      <hr style={{ width: "100%" }} />

      <div className="checkbox-group">
        <label className="checkbox">
          Allow your book collection to be viewed publicly?
          <input
            onChange={evt => {
              setPendingIsPublic(evt.target.checked);
            }}
            defaultChecked={pendingIsPublic}
            disabled={saving}
            style={{ marginLeft: "5px" }}
            type="checkbox"
          />
        </label>
      </div>
      <div style={{ marginLeft: "20px" }}>
        <Form submit={update}>
          <FlexRow>
            {pendingIsPublic ? (
              <>
                <div className="col-xs-12">
                  <div className="form-group">
                    <label>Publicly display your name as</label>
                    <Input
                      name="displayName"
                      validate={required}
                      ref={pubNameEl}
                      defaultValue={publicName}
                      disabled={saving}
                      placeholder="Public name"
                    />
                  </div>
                </div>
                <div className="col-xs-12">
                  <div className="form-group">
                    <label>Publicly display your collection as</label>
                    <input ref={pubHeaderEl} defaultValue={publicBooksHeader} disabled={saving} className="form-control" placeholder="Book header" />
                  </div>
                </div>
              </>
            ) : null}
            <div className="col-xs-12">
              <SubmitButton style={{ minWidth: "10ch" }} text="Save" runningText="Saving" finishedText="Saved" preset="primary" />
            </div>
          </FlexRow>
        </Form>
      </div>
    </Stack>
  );
};

export default PublicUserSettings;
